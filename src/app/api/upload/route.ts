import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const issueId = formData.get("issueId") as string
    const description = formData.get("description") as string

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${fileName}`

    let mediaType: "IMAGE" | "VIDEO" | "DOCUMENT" = "DOCUMENT"
    const mimeType = file.type.toLowerCase()
    if (mimeType.startsWith("image/")) {
      mediaType = "IMAGE"
    } else if (mimeType.startsWith("video/")) {
      mediaType = "VIDEO"
    }

    if (issueId) {
      const media = await prisma.media.create({
        data: {
          url: fileUrl,
          type: mediaType,
          filename: file.name,
          size: file.size,
          description,
          issueId,
        },
      })
      return NextResponse.json(media, { status: 201 })
    }

    return NextResponse.json({ url: fileUrl, type: mediaType }, { status: 201 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
