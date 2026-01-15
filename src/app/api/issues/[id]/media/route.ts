import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const images = formData.getAll("images") as File[]
    const videos = formData.getAll("videos") as File[]

    // For now, we'll create media records with placeholder URLs
    // In production, you would upload to Vercel Blob Storage first
    const mediaRecords = []

    for (const image of images) {
      const media = await prisma.media.create({
        data: {
          issueId: id,
          type: "IMAGE",
          url: `/uploads/placeholder-${Date.now()}-${image.name}`, // Placeholder
        },
      })
      mediaRecords.push(media)
    }

    for (const video of videos) {
      const media = await prisma.media.create({
        data: {
          issueId: id,
          type: "VIDEO",
          url: `/uploads/placeholder-${Date.now()}-${video.name}`, // Placeholder
        },
      })
      mediaRecords.push(media)
    }

    return NextResponse.json({ 
      success: true, 
      media: mediaRecords,
      message: "Medya dosyaları kaydedildi (geliştirme modu - gerçek upload için Vercel Blob gerekli)" 
    })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
