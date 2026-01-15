import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Prisma db push komutunu çalıştır
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss")
    
    return NextResponse.json({
      success: true,
      message: "Veritabanı tabloları başarıyla oluşturuldu",
      output: stdout,
      errors: stderr || "Hata yok"
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json({
      success: false,
      error: "Migration hatası",
      details: error?.message || "Bilinmeyen hata",
      stdout: error?.stdout || "",
      stderr: error?.stderr || ""
    }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}
