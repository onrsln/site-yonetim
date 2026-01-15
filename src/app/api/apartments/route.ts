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
    const floorId = searchParams.get("floorId")

    const apartments = await prisma.apartment.findMany({
      where: {
        isActive: true,
        ...(floorId && { floorId }),
      },
      include: {
        floor: {
          select: {
            name: true,
            number: true,
            block: {
              select: {
                name: true,
                site: { select: { name: true } },
              },
            },
          },
        },
        _count: {
          select: { issues: true, assets: true },
        },
      },
      orderBy: { number: "asc" },
    })

    return NextResponse.json(apartments)
  } catch (error) {
    console.error("Error fetching apartments:", error)
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
    const { number, floorId, type, area, roomCount, ownerName, ownerPhone, ownerEmail, description } = body

    if (!number || !floorId) {
      return NextResponse.json({ error: "Daire numarası ve kat zorunludur" }, { status: 400 })
    }

    const apartment = await prisma.apartment.create({
      data: {
        number,
        floorId,
        type,
        area,
        roomCount,
        ownerName,
        ownerPhone,
        ownerEmail,
        description,
      },
    })

    return NextResponse.json(apartment, { status: 201 })
  } catch (error) {
    console.error("Error creating apartment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
