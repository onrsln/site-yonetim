import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ImageRun,
  WidthType,
  AlignmentType,
  BorderStyle,
  HeadingLevel,
} from "docx"
import { readFileSync } from "fs"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { siteId, blockId, status, priority, startDate, endDate } = body

    const where: any = {}
    if (siteId) where.siteId = siteId
    if (blockId) where.blockId = blockId
    if (status) where.status = status
    if (priority) where.priority = priority
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const issues = await prisma.issue.findMany({
      where,
      include: {
        site: { select: { name: true } },
        block: { select: { name: true } },
        floor: { select: { name: true } },
        apartment: { select: { number: true } },
        floorArea: { select: { name: true } },
        commonArea: { select: { name: true } },
        createdBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
        media: true,
      },
      orderBy: { createdAt: "desc" },
    })

    const priorityLabels: Record<string, string> = {
      LOW: "Düşük",
      MEDIUM: "Orta",
      HIGH: "Yüksek",
      URGENT: "Acil",
    }

    const statusLabels: Record<string, string> = {
      OPEN: "Açık",
      IN_PROGRESS: "Devam Ediyor",
      WAITING: "Beklemede",
      RESOLVED: "Çözüldü",
      CLOSED: "Kapatıldı",
      CANCELLED: "İptal",
    }

    const getLocation = (issue: any) => {
      const parts = []
      if (issue.site) parts.push(issue.site.name)
      if (issue.block) parts.push(issue.block.name)
      if (issue.floor) parts.push(issue.floor.name)
      if (issue.apartment) parts.push(`Daire ${issue.apartment.number}`)
      if (issue.floorArea) parts.push(issue.floorArea.name)
      if (issue.commonArea) parts.push(issue.commonArea.name)
      return parts.join(" > ") || "-"
    }

    const rows: TableRow[] = []

    rows.push(
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "#", bold: true })] })],
          }),
          new TableCell({
            width: { size: 3000, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Başlık", bold: true })] })],
          }),
          new TableCell({
            width: { size: 2500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Konum", bold: true })] })],
          }),
          new TableCell({
            width: { size: 1000, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Öncelik", bold: true })] })],
          }),
          new TableCell({
            width: { size: 1200, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Durum", bold: true })] })],
          }),
          new TableCell({
            width: { size: 1500, type: WidthType.DXA },
            children: [new Paragraph({ children: [new TextRun({ text: "Tarih", bold: true })] })],
          }),
        ],
      })
    )

    issues.forEach((issue: any, index: number) => {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: String(index + 1) })],
            }),
            new TableCell({
              children: [new Paragraph({ text: issue.title })],
            }),
            new TableCell({
              children: [new Paragraph({ text: getLocation(issue) })],
            }),
            new TableCell({
              children: [new Paragraph({ text: priorityLabels[issue.priority] || issue.priority })],
            }),
            new TableCell({
              children: [new Paragraph({ text: statusLabels[issue.status] || issue.status })],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: new Date(issue.createdAt).toLocaleDateString("tr-TR"),
                }),
              ],
            }),
          ],
        })
      )
    })

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Eksiklik Raporu",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `Oluşturulma Tarihi: ${new Date().toLocaleDateString("tr-TR")}`,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({
              text: `Toplam ${issues.length} kayıt`,
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({ text: "" }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            ...issues.flatMap((issue: any, index: number) => {
              const detailParagraphs: Paragraph[] = [
                new Paragraph({
                  text: `${index + 1}. ${issue.title}`,
                  heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Konum: ", bold: true }),
                    new TextRun({ text: getLocation(issue) }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Öncelik: ", bold: true }),
                    new TextRun({ text: priorityLabels[issue.priority] || issue.priority }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Durum: ", bold: true }),
                    new TextRun({ text: statusLabels[issue.status] || issue.status }),
                  ],
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: "Oluşturan: ", bold: true }),
                    new TextRun({ text: issue.createdBy.name }),
                  ],
                }),
              ]

              if (issue.description) {
                detailParagraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Açıklama: ", bold: true }),
                      new TextRun({ text: issue.description }),
                    ],
                  })
                )
              }

              detailParagraphs.push(new Paragraph({ text: "" }))

              return detailParagraphs
            }),
          ],
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="eksiklik-raporu-${new Date().toISOString().split("T")[0]}.docx"`,
      },
    })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
