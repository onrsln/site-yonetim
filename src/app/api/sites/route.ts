import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sites = await prisma.site.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            blocks: true,
            commonAreas: true,
            issues: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(sites)
  } catch (error) {
    console.error("Error fetching sites:", error)
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
    const { name, address, city, district, description } = body

    if (!name) {
      return NextResponse.json({ error: "Site adı zorunludur" }, { status: 400 })
    }

    const site = await prisma.site.create({
      data: {
        name,
        address,
        city,
        district,
        description,
      },
    })

    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error("Error creating site:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
