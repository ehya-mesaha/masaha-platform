import type { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  ADMIN_EXPORT_DATASETS,
  loadAdminExportData,
  type AdminExportDataset,
} from '@/lib/admin-export-data'
import { createExcelExport, createPdfExport } from '@/lib/admin-export-files'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const isDataset = (value: string): value is AdminExportDataset =>
  ADMIN_EXPORT_DATASETS.includes(value as AdminExportDataset)

const parseDate = (value: string | null, endOfDay = false) => {
  if (!value) return undefined
  const suffix = endOfDay ? 'T23:59:59.999+03:00' : 'T00:00:00.000+03:00'
  const date = new Date(`${value}${suffix}`)
  return Number.isNaN(date.valueOf()) ? undefined : date
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dataset: string }> }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return Response.json({ error: 'غير مصرح لك بتصدير بيانات الإدارة.' }, { status: 403 })
  }

  const { dataset } = await params
  if (!isDataset(dataset)) {
    return Response.json({ error: 'نوع البيانات المطلوب غير مدعوم.' }, { status: 400 })
  }

  const format = request.nextUrl.searchParams.get('format') === 'pdf' ? 'pdf' : 'xlsx'
  const from = parseDate(request.nextUrl.searchParams.get('from'))
  const to = parseDate(request.nextUrl.searchParams.get('to'), true)
  if (from && to && from > to) {
    return Response.json({ error: 'تاريخ البداية يجب أن يسبق تاريخ النهاية.' }, { status: 400 })
  }

  try {
    const sheets = await loadAdminExportData(dataset, { from, to })
    const bytes =
      format === 'pdf' ? await createPdfExport(sheets) : await createExcelExport(sheets)
    const now = new Date().toISOString().slice(0, 10)
    const fileName = `ehya-masaha-${dataset}-${now}.${format}`

    await prisma.adminAuditLog
      .create({
        data: {
          action: `EXPORT_${format.toUpperCase()}`,
          entityType: 'ADMIN_DATA_EXPORT',
          entityId: dataset,
          after: {
            dataset,
            format,
            from: from?.toISOString() || null,
            to: to?.toISOString() || null,
            sheets: sheets.map((sheet) => ({
              id: sheet.id,
              records: sheet.rows.length,
            })),
          },
          actorId: user.id as string,
        },
      })
      .catch(() => null)

    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type':
          format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Admin export failed', error)
    return Response.json(
      { error: 'تعذر إنشاء ملف التصدير الآن. حاول مرة أخرى.' },
      { status: 500 }
    )
  }
}
