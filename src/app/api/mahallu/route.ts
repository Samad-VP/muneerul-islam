import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, arabicName, address, district, panchayat, pincode, phone, email, president, secretary, imam, established } = body

    if (!name) {
      return NextResponse.json({ error: "Mahallu name is required" }, { status: 400 })
    }

    const mahallu = await prisma.mahallu.create({
      data: { name, arabicName, address, district, panchayat, pincode, phone, email, president, secretary, imam, established }
    })

    return NextResponse.json(mahallu, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const mahallus = await prisma.mahallu.findMany({
      include: {
        _count: { select: { families: true, committees: true } }
      }
    })
    return NextResponse.json(mahallus)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
