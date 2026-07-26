import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const sourceRoot = path.resolve('src')
const dictionaryFiles = [
  path.join(sourceRoot, 'lib', 'domTranslations.ts'),
  path.join(sourceRoot, 'lib', 'supplementalTranslations.ts'),
]
const ignoredFiles = new Set([
  ...dictionaryFiles,
  path.join(sourceRoot, 'lib', 'i18n.ts'),
])
const arabicPattern = /[\u0600-\u06ff]/u
const translationKeys = new Set()
const literals = new Map()

for (const file of dictionaryFiles) {
  const source = fs.readFileSync(file, 'utf8')
  for (const match of source.matchAll(/^\s*'((?:\\'|[^'])*[\u0600-\u06ff](?:\\'|[^'])*)'\s*:/gmu)) {
    translationKeys.add(match[1].replaceAll("\\'", "'"))
  }
}

function normalize(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function addLiteral(value, file, node) {
  const text = normalize(value)
  if (text.length < 2 || !arabicPattern.test(text)) return

  const sourceFile = node.getSourceFile()
  const position = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart())
  const location = `${path.relative(process.cwd(), file)}:${position.line + 1}`
  const locations = literals.get(text) ?? []
  locations.push(location)
  literals.set(text, locations)
}

function scanFile(file) {
  const source = fs.readFileSync(file, 'utf8')
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )

  function visit(node) {
    if (
      ts.isJsxText(node)
      || ts.isStringLiteralLike(node)
      || ts.isTemplateHead(node)
      || ts.isTemplateMiddle(node)
      || ts.isTemplateTail(node)
    ) {
      addLiteral(node.text, file, node)
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      walk(file)
      continue
    }
    if (!/\.(?:ts|tsx|js|jsx)$/.test(entry.name) || ignoredFiles.has(file)) continue
    scanFile(file)
  }
}

walk(sourceRoot)

const missing = [...literals.entries()]
  .filter(([text]) => !translationKeys.has(text))
  .sort(([left], [right]) => left.localeCompare(right, 'ar'))

if (missing.length > 0) {
  console.error(`Missing English coverage for ${missing.length} Arabic UI literals:`)
  for (const [text, locations] of missing) {
    console.error(`${locations[0]}\t${JSON.stringify(text)}`)
  }
  process.exitCode = 1
} else {
  console.log(`Bilingual coverage passed for ${literals.size} Arabic UI literals.`)
}
