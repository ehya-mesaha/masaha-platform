import ExcelJS from 'exceljs'
import { PDFDocument, PDFPage, PDFFont, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { ExportCell, ExportSheet } from '@/lib/admin-export-data'

const GREEN = '0E3B34'
const GREEN_DARK = '092C27'
const GOLD = 'B99A63'
const SAND = 'F5F1E8'
const BORDER = 'D8D1C7'

const formatDateTime = (value: Date) =>
  new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Riyadh',
  }).format(value)

const formatCell = (value: ExportCell) => {
  if (value === null || value === undefined || value === '') return '—'
  if (value instanceof Date) return formatDateTime(value)
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا'
  return String(value)
}

const columnLetter = (column: number) => {
  let dividend = column
  let name = ''
  while (dividend > 0) {
    const modulo = (dividend - 1) % 26
    name = String.fromCharCode(65 + modulo) + name
    dividend = Math.floor((dividend - modulo) / 26)
  }
  return name
}

export async function createExcelExport(sheets: ExportSheet[]) {
  const workbook = new ExcelJS.Workbook()
  const generatedAt = new Date()
  workbook.creator = 'إحياء مساحة'
  workbook.company = 'إحياء مساحة'
  workbook.subject = 'تصدير بيانات الإدارة'
  workbook.created = generatedAt
  workbook.modified = generatedAt
  workbook.calcProperties.fullCalcOnLoad = true

  for (const sheetData of sheets) {
    const worksheet = workbook.addWorksheet(sheetData.name.slice(0, 31), {
      properties: { tabColor: { argb: `FF${GOLD}` } },
      views: [{ rightToLeft: true, state: 'frozen', ySplit: 4 }],
      pageSetup: {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        paperSize: 9,
      },
    })
    const lastColumn = columnLetter(sheetData.columns.length)

    worksheet.mergeCells(`A1:${lastColumn}1`)
    worksheet.getCell('A1').value = `إحياء مساحة | ${sheetData.name}`
    worksheet.getCell('A1').font = { name: 'Arial', size: 17, bold: true, color: { argb: 'FFFFFFFF' } }
    worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GREEN}` } }
    worksheet.getCell('A1').alignment = { horizontal: 'right', vertical: 'middle' }
    worksheet.getRow(1).height = 32

    worksheet.mergeCells(`A2:${lastColumn}2`)
    worksheet.getCell('A2').value = `${sheetData.description} · ${sheetData.rows.length.toLocaleString('ar-SA')} سجل · ${formatDateTime(generatedAt)}`
    worksheet.getCell('A2').font = { name: 'Arial', size: 10, color: { argb: `FF${GREEN_DARK}` } }
    worksheet.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${SAND}` } }
    worksheet.getCell('A2').alignment = { horizontal: 'right', vertical: 'middle' }
    worksheet.getRow(2).height = 24
    worksheet.getRow(3).height = 8

    const header = worksheet.getRow(4)
    header.values = sheetData.columns.map((column) => column.label)
    header.height = 27
    header.eachCell((cell) => {
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${GREEN_DARK}` } }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'thin', color: { argb: `FF${GREEN_DARK}` } },
        bottom: { style: 'thin', color: { argb: `FF${GOLD}` } },
        left: { style: 'thin', color: { argb: `FF${GREEN}` } },
        right: { style: 'thin', color: { argb: `FF${GREEN}` } },
      }
    })

    sheetData.columns.forEach((column, index) => {
      worksheet.getColumn(index + 1).width = column.width || 20
    })

    sheetData.rows.forEach((source, rowIndex) => {
      const row = worksheet.addRow(
        sheetData.columns.map((column) => {
          const value = source[column.key]
          if (value instanceof Date) return value
          if (value === null || value === undefined) return ''
          return value
        })
      )
      row.height = 23
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: 'Arial', size: 9, color: { argb: 'FF25322E' } }
        cell.alignment = { horizontal: 'right', vertical: 'middle', wrapText: true }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowIndex % 2 === 0 ? 'FFFFFFFF' : 'FFFAF8F3' },
        }
        cell.border = {
          bottom: { style: 'hair', color: { argb: `FF${BORDER}` } },
        }
        if (cell.value instanceof Date) {
          cell.numFmt = 'yyyy-mm-dd hh:mm'
        } else if (typeof cell.value === 'number') {
          cell.numFmt = '#,##0.00'
        }
      })
    })

    if (sheetData.rows.length > 0) {
      worksheet.autoFilter = {
        from: 'A4',
        to: `${lastColumn}${sheetData.rows.length + 4}`,
      }
    }
    worksheet.headerFooter.oddFooter = '&Rإحياء مساحة&Cصفحة &P من &N&Lسري — للاستخدام الإداري'
  }

  return workbook.xlsx.writeBuffer()
}

type PdfContext = {
  document: PDFDocument
  font: PDFFont
  pages: PDFPage[]
  generatedAt: Date
}

const A4_LANDSCAPE: [number, number] = [841.89, 595.28]
const PAGE_MARGIN = 34
const TABLE_RIGHT = A4_LANDSCAPE[0] - PAGE_MARGIN
const ROW_HEIGHT = 24

function drawRightAligned(
  page: PDFPage,
  font: PDFFont,
  text: string,
  right: number,
  y: number,
  size: number,
  color = rgb(0.1, 0.15, 0.13)
) {
  const safeText = text.replace(/\s+/g, ' ').trim()
  const width = font.widthOfTextAtSize(safeText, size)
  page.drawText(safeText, { x: right - width, y, size, font, color })
}

function truncateForWidth(font: PDFFont, value: string, width: number, size: number) {
  if (font.widthOfTextAtSize(value, size) <= width) return value
  let output = value
  while (output.length > 1 && font.widthOfTextAtSize(`…${output}`, size) > width) {
    output = output.slice(0, -1)
  }
  return `…${output}`
}

function addPage(context: PdfContext, title: string) {
  const page = context.document.addPage(A4_LANDSCAPE)
  context.pages.push(page)
  page.drawRectangle({
    x: 0,
    y: A4_LANDSCAPE[1] - 68,
    width: A4_LANDSCAPE[0],
    height: 68,
    color: rgb(14 / 255, 59 / 255, 52 / 255),
  })
  page.drawRectangle({
    x: 0,
    y: A4_LANDSCAPE[1] - 72,
    width: A4_LANDSCAPE[0],
    height: 4,
    color: rgb(185 / 255, 154 / 255, 99 / 255),
  })
  drawRightAligned(page, context.font, 'إحياء مساحة', TABLE_RIGHT, A4_LANDSCAPE[1] - 34, 18, rgb(1, 1, 1))
  drawRightAligned(page, context.font, title, TABLE_RIGHT, A4_LANDSCAPE[1] - 54, 10, rgb(0.83, 0.76, 0.61))
  return page
}

function drawTableHeader(
  page: PDFPage,
  font: PDFFont,
  columns: { label: string; key: string; width: number }[],
  y: number
) {
  let right = TABLE_RIGHT
  for (const column of columns) {
    page.drawRectangle({
      x: right - column.width,
      y: y - 6,
      width: column.width,
      height: ROW_HEIGHT,
      color: rgb(9 / 255, 44 / 255, 39 / 255),
      borderColor: rgb(185 / 255, 154 / 255, 99 / 255),
      borderWidth: 0.5,
    })
    const text = truncateForWidth(font, column.label, column.width - 10, 8)
    drawRightAligned(page, font, text, right - 5, y + 2, 8, rgb(1, 1, 1))
    right -= column.width
  }
}

function drawPdfFooter(context: PdfContext) {
  context.pages.forEach((page, index) => {
    const pageLabel = `صفحة ${index + 1} من ${context.pages.length}`
    drawRightAligned(page, context.font, pageLabel, TABLE_RIGHT, 17, 8, rgb(0.35, 0.4, 0.38))
    page.drawText(`Ehya Masaha · ${context.generatedAt.toISOString()}`, {
      x: PAGE_MARGIN,
      y: 17,
      size: 7,
      font: context.font,
      color: rgb(0.35, 0.4, 0.38),
    })
  })
}

export async function createPdfExport(sheets: ExportSheet[]) {
  const document = await PDFDocument.create()
  document.registerFontkit(fontkit)
  const fontBytes = await readFile(
    path.join(process.cwd(), 'public', 'fonts', 'ibm-plex-sans-arabic.woff')
  )
  const font = await document.embedFont(fontBytes, { subset: true })
  const context: PdfContext = { document, font, pages: [], generatedAt: new Date() }
  document.setTitle('تقرير إحياء مساحة')
  document.setAuthor('إحياء مساحة')
  document.setCreator('مركز بيانات الإدارة')
  document.setProducer('إحياء مساحة')
  document.setCreationDate(context.generatedAt)

  for (const sheet of sheets) {
    const selectedColumns = sheet.columns.slice(0, Math.min(sheet.columns.length, 7))
    const totalConfiguredWidth = selectedColumns.reduce(
      (sum, column) => sum + Math.max(column.width || 18, 12),
      0
    )
    const availableWidth = A4_LANDSCAPE[0] - PAGE_MARGIN * 2
    const columns = selectedColumns.map((column) => ({
      key: column.key,
      label: column.label,
      width: (Math.max(column.width || 18, 12) / totalConfiguredWidth) * availableWidth,
    }))
    let page = addPage(context, `${sheet.name} · ${sheet.rows.length.toLocaleString('ar-SA')} سجل`)
    let y = A4_LANDSCAPE[1] - 108
    drawTableHeader(page, font, columns, y)
    y -= ROW_HEIGHT

    if (sheet.rows.length === 0) {
      drawRightAligned(page, font, 'لا توجد بيانات ضمن النطاق المحدد.', TABLE_RIGHT, y - 18, 11)
      continue
    }

    for (let rowIndex = 0; rowIndex < sheet.rows.length; rowIndex += 1) {
      if (y < 55) {
        page = addPage(context, `${sheet.name} · متابعة`)
        y = A4_LANDSCAPE[1] - 108
        drawTableHeader(page, font, columns, y)
        y -= ROW_HEIGHT
      }

      let right = TABLE_RIGHT
      const row = sheet.rows[rowIndex]
      for (const column of columns) {
        page.drawRectangle({
          x: right - column.width,
          y: y - 6,
          width: column.width,
          height: ROW_HEIGHT,
          color:
            rowIndex % 2 === 0
              ? rgb(1, 1, 1)
              : rgb(250 / 255, 248 / 255, 243 / 255),
          borderColor: rgb(216 / 255, 209 / 255, 199 / 255),
          borderWidth: 0.35,
        })
        const text = truncateForWidth(font, formatCell(row[column.key]), column.width - 10, 7.5)
        drawRightAligned(page, font, text, right - 5, y + 2, 7.5)
        right -= column.width
      }
      y -= ROW_HEIGHT
    }
  }

  drawPdfFooter(context)
  return document.save()
}
