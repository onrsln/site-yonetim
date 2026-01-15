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
    const blockId = searchParams.get("blockId")

    const floors = await prisma.floor.findMany({
      where: {
        isActive: true,
        ...(blockId && { blockId }),
      },
      include: {
        block: { 
          select: { 
            name: true, 
            site: { select: { name: true } } 
          } 
        },
        _count: {
          select: { apartments: true, floorAreas: true, issues: true },
        },
      },
      orderBy: [{ block: { name: "asc" } }, { number: "asc" }],
    })

    return NextResponse.json(floors)
  } catch (error) {
    console.error("Error fetching floors:", error)
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
    const { name, number, blockId, description } = body

    if (!name || number === undefined || !blockId) {
      return NextResponse.json({ error: "Kat adı, numarası ve blok zorunludur" }, { status: 400 })
    }

    const floor = await prisma.floor.create({
      data: {
        name,
        number,
        blockId,
        description,
      },
    })

    return NextResponse.json(floor, { status: 201 })
  } catch (error) {
    console.error("Error creating floor:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
