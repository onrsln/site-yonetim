import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

async function seedData() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@site.com" },
    })

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin kullanıcı zaten mevcut" })
    }

    const hashedPassword = await bcrypt.hash("admin123", 12)

    const admin = await prisma.user.create({
      data: {
        email: "admin@site.com",
        password: hashedPassword,
        name: "Admin Kullanıcı",
        role: "ADMIN",
      },
    })

    const site = await prisma.site.create({
      data: {
        name: "Örnek Site",
        address: "Örnek Mahallesi, Örnek Sokak No:1",
        city: "İstanbul",
        district: "Kadıköy",
        description: "8 bloktan oluşan örnek toplu konut sitesi",
      },
    })

    const blockNames = ["A", "B", "C", "D", "E", "F", "G", "H"]
    for (const blockName of blockNames) {
      const block = await prisma.block.create({
        data: {
          name: `${blockName} Blok`,
          siteId: site.id,
          totalFloors: 10,
          description: `${blockName} Blok - 10 katlı`,
        },
      })

      for (let floorNum = -1; floorNum <= 10; floorNum++) {
        const floorName = floorNum === -1 ? "Bodrum Kat" : floorNum === 0 ? "Zemin Kat" : `${floorNum}. Kat`
        
        const floor = await prisma.floor.create({
          data: {
            name: floorName,
            number: floorNum,
            blockId: block.id,
          },
        })

        if (floorNum >= 1) {
          for (let aptNum = 1; aptNum <= 4; aptNum++) {
            const apartmentNumber = `${floorNum}0${aptNum}`
            await prisma.apartment.create({
              data: {
                number: apartmentNumber,
                floorId: floor.id,
                type: aptNum <= 2 ? "2+1" : "3+1",
                roomCount: aptNum <= 2 ? 3 : 4,
              },
            })
          }
        }

        await prisma.floorArea.createMany({
          data: [
            { name: "Merdiven Boşluğu", type: "STAIRCASE", floorId: floor.id },
            { name: "Yolcu Asansörü", type: "ELEVATOR_PASSENGER", floorId: floor.id },
            { name: "Sayaç Şaftı", type: "METER_SHAFT", floorId: floor.id },
          ],
        })
      }
    }

    await prisma.commonArea.createMany({
      data: [
        { name: "Çocuk Oyun Parkı", type: "PLAYGROUND", siteId: site.id, area: 500 },
        { name: "Fitness Salonu", type: "FITNESS", siteId: site.id, area: 200, capacity: 30 },
        { name: "Spa & Sauna", type: "SPA", siteId: site.id, area: 150, capacity: 20 },
        { name: "Hamam", type: "HAMMAM", siteId: site.id, area: 100, capacity: 15 },
        { name: "Kapalı Otopark", type: "PARKING_INDOOR", siteId: site.id, area: 5000, capacity: 200 },
        { name: "Açık Otopark", type: "PARKING", siteId: site.id, area: 3000, capacity: 150 },
        { name: "Jeneratör Odası", type: "GENERATOR", siteId: site.id, area: 50 },
        { name: "Trafo Merkezi", type: "TRANSFORMER", siteId: site.id, area: 40 },
        { name: "Güvenlik Kulübesi", type: "SECURITY", siteId: site.id, area: 20 },
        { name: "Site Yönetim Ofisi", type: "MANAGEMENT_OFFICE", siteId: site.id, area: 80 },
      ],
    })

    return NextResponse.json({
      message: "Seed başarılı",
      admin: { email: admin.email, password: "admin123" },
      site: site.name,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Seed hatası" }, { status: 500 })
  }
}

export async function GET() {
  return seedData()
}

export async function POST() {
  return seedData()
}
