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

    const blocks = await prisma.block.findMany({
      where: {
        isActive: true,
        ...(siteId && { siteId }),
      },
      include: {
        site: { select: { name: true } },
        _count: {
          select: { floors: true, issues: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(blocks)
  } catch (error) {
    console.error("Error fetching blocks:", error)
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
    const { name, siteId, description, totalFloors } = body

    if (!name || !siteId) {
      return NextResponse.json({ error: "Blok adı ve site zorunludur" }, { status: 400 })
    }

    const block = await prisma.block.create({
      data: {
        name,
        siteId,
        description,
        totalFloors: totalFloors || 0,
      },
    })

    return NextResponse.json(block, { status: 201 })
  } catch (error) {
    console.error("Error creating block:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
