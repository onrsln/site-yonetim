import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const issue = await prisma.issue.findUnique({
      where: { id: params.id },
      include: {
        site: true,
        block: true,
        floor: true,
        apartment: true,
        floorArea: true,
        commonArea: true,
        asset: true,
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        media: true,
        comments: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!issue) {
      return NextResponse.json({ error: "Eksiklik bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error fetching issue:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      status,
      assignedToId,
      dueDate,
      estimatedCost,
      actualCost,
    } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (priority !== undefined) updateData.priority = priority
    if (status !== undefined) updateData.status = status
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null
    if (estimatedCost !== undefined) updateData.estimatedCost = estimatedCost
    if (actualCost !== undefined) updateData.actualCost = actualCost

    if (status === "RESOLVED" || status === "CLOSED") {
      updateData.resolvedAt = new Date()
    }

    const issue = await prisma.issue.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(issue)
  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.issue.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting issue:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
