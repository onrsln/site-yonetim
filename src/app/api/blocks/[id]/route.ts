import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const block = await prisma.block.findUnique({
      where: { id },
      include: {
        site: true,
        floors: {
          where: { isActive: true },
          orderBy: { number: "asc" },
          include: {
            _count: { select: { apartments: true, floorAreas: true } },
          },
        },
        _count: {
          select: { floors: true, issues: true, assets: true },
        },
      },
    })

    if (!block) {
      return NextResponse.json({ error: "Blok bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(block)
  } catch (error) {
    console.error("Error fetching block:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, totalFloors, isActive } = body

    const block = await prisma.block.update({
      where: { id },
      data: { name, description, totalFloors, isActive },
    })

    return NextResponse.json(block)
  } catch (error) {
    console.error("Error updating block:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.block.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting block:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
