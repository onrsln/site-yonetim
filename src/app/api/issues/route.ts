import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get("siteId")
    const blockId = searchParams.get("blockId")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    const issues = await prisma.issue.findMany({
      where: {
        ...(siteId && { siteId }),
        ...(blockId && { blockId }),
        ...(status && { status: status as any }),
        ...(priority && { priority: priority as any }),
      },
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
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(issues)
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      type,
      priority,
      siteId,
      blockId,
      floorId,
      apartmentId,
      floorAreaId,
      commonAreaId,
      assetId,
      dueDate,
      estimatedCost,
    } = body

    if (!title) {
      return NextResponse.json({ error: "Başlık zorunludur" }, { status: 400 })
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        type: type || "DEFICIENCY",
        priority: priority || "MEDIUM",
        siteId,
        blockId,
        floorId,
        apartmentId,
        floorAreaId,
        commonAreaId,
        assetId,
        createdById: (session.user as any).id,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedCost,
      },
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error("Error creating issue:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
