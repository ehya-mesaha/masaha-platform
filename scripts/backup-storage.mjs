// Incremental backup of Supabase Storage buckets.
//
// Downloads only files that are not already recorded in the manifest, so a
// nightly run costs almost no egress once the initial sync is done. The caller
// (see .github/workflows/backup-storage.yml) is responsible for encrypting and
// uploading whatever lands in --out, and for persisting the updated manifest.
import { createClient } from '@supabase/supabase-js'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

const BUCKETS = ['spaces', 'documents']
const PAGE_SIZE = 100

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}

const outDir = arg('out', 'storage-backup')
const manifestPath = arg('manifest', 'manifest.json')

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

async function loadManifest() {
  try {
    return JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch {
    return { files: {} }
  }
}

// Storage has no recursive listing: walk prefix by prefix.
async function* walk(bucket, prefix = '') {
  let offset = 0
  for (;;) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit: PAGE_SIZE, offset, sortBy: { column: 'name', order: 'asc' } })
    if (error) throw new Error(`list ${bucket}/${prefix}: ${error.message}`)
    if (!data || data.length === 0) return

    for (const entry of data) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name
      // Folders come back without an id / metadata.
      if (entry.id === null || entry.id === undefined) {
        yield* walk(bucket, path)
      } else {
        yield { path, size: entry.metadata?.size ?? null, updatedAt: entry.updated_at ?? null }
      }
    }

    if (data.length < PAGE_SIZE) return
    offset += PAGE_SIZE
  }
}

const manifest = await loadManifest()
let downloaded = 0
let skipped = 0
let failed = 0
let bytes = 0

for (const bucket of BUCKETS) {
  for await (const file of walk(bucket)) {
    const key = `${bucket}/${file.path}`
    const known = manifest.files[key]
    // Same size and same mtime means we already hold an identical copy.
    if (known && known.size === file.size && known.updatedAt === file.updatedAt) {
      skipped += 1
      continue
    }

    const { data, error } = await supabase.storage.from(bucket).download(file.path)
    if (error || !data) {
      console.error(`FAILED ${key}: ${error?.message ?? 'no data'}`)
      failed += 1
      continue
    }

    const target = join(outDir, bucket, file.path)
    await mkdir(dirname(target), { recursive: true })
    const buffer = Buffer.from(await data.arrayBuffer())
    await writeFile(target, buffer)

    manifest.files[key] = { size: file.size, updatedAt: file.updatedAt, backedUpAt: new Date().toISOString() }
    downloaded += 1
    bytes += buffer.length
  }
}

manifest.lastRunAt = new Date().toISOString()
await writeFile(manifestPath, JSON.stringify(manifest, null, 2))

console.log(`new=${downloaded} unchanged=${skipped} failed=${failed} bytes=${bytes}`)
await writeFile(process.env.GITHUB_OUTPUT ?? '/dev/null', `new_files=${downloaded}\n`, { flag: 'a' })

// A failure to download is a hole in the backup - fail the job loudly.
if (failed > 0) process.exit(1)
