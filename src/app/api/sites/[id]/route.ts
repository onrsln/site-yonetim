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

    const site = await prisma.site.findUnique({
      where: { id: params.id },
      include: {
        blocks: {
          where: { isActive: true },
          include: {
            _count: { select: { floors: true } },
          },
        },
        commonAreas: { where: { isActive: true } },
        _count: {
          select: {
            blocks: true,
            commonAreas: true,
            issues: true,
            assets: true,
          },
        },
      },
    })

    if (!site) {
      return NextResponse.json({ error: "Site bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(site)
  } catch (error) {
    console.error("Error fetching site:", error)
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
    const { name, address, city, district, description, isActive } = body

    const site = await prisma.site.update({
      where: { id: params.id },
      data: {
        name,
        address,
        city,
        district,
        description,
        isActive,
      },
    })

    return NextResponse.json(site)
  } catch (error) {
    console.error("Error updating site:", error)
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

    await prisma.site.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
