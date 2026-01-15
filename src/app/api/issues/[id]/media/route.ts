import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"

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

    const mediaRecords = []

    // Upload images to Vercel Blob Storage
    for (const image of images) {
      try {
        const blob = await put(`issues/${id}/${Date.now()}-${image.name}`, image, {
          access: "public",
          addRandomSuffix: true,
        })

        const media = await prisma.media.create({
          data: {
            issueId: id,
            type: "IMAGE",
            url: blob.url,
          },
        })
        mediaRecords.push(media)
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError)
      }
    }

    // Upload videos to Vercel Blob Storage
    for (const video of videos) {
      try {
        const blob = await put(`issues/${id}/${Date.now()}-${video.name}`, video, {
          access: "public",
          addRandomSuffix: true,
        })

        const media = await prisma.media.create({
          data: {
            issueId: id,
            type: "VIDEO",
            url: blob.url,
          },
        })
        mediaRecords.push(media)
      } catch (uploadError) {
        console.error("Error uploading video:", uploadError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      media: mediaRecords,
      message: `${mediaRecords.length} medya dosyası başarıyla yüklendi` 
    })
  } catch (error) {
    console.error("Error uploading media:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
