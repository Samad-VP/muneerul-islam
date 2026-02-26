import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const mahalluId = searchParams.get("mahalluId") || ""

    const where: any = {}
    if (mahalluId) where.mahalluId = mahalluId
    if (search) {
      where.OR = [
        { houseName: { contains: search } },
        { familyNumber: { contains: search } },
        { members: { some: { name: { contains: search } } } }
      ]
    }

    const [families, total] = await Promise.all([
      prisma.family.findMany({
        where,
        include: {
          members: { orderBy: { createdAt: "asc" } },
          _count: { select: { members: true } }
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.family.count({ where })
    ])

    return NextResponse.json({ families, total, page, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { familyNumber, houseName, houseNumber, address, ward, phone, rationCardNo, annualIncome, notes, mahalluId, members } = body

    if (!familyNumber || !houseName || !mahalluId) {
      return NextResponse.json({ error: "Family number, house name, and mahallu ID are required" }, { status: 400 })
    }

    const existing = await prisma.family.findUnique({ where: { familyNumber } })
    if (existing) {
      return NextResponse.json({ error: "Family number already exists" }, { status: 400 })
    }

    const family = await prisma.family.create({
      data: {
        familyNumber,
        houseName,
        houseNumber,
        address,
        ward,
        phone,
        rationCardNo,
        annualIncome,
        notes,
        mahalluId,
        members: members?.length ? {
          create: members.map((m: any) => ({
            name: m.name,
            arabicName: m.arabicName,
            relationToHead: m.relationToHead,
            gender: m.gender,
            dob: m.dob ? new Date(m.dob) : null,
            age: m.age ? parseInt(m.age) : null,
            maritalStatus: m.maritalStatus,
            phone: m.phone,
            email: m.email,
            bloodGroup: m.bloodGroup,
            education: m.education,
            educationDetail: m.educationDetail,
            occupation: m.occupation,
            occupationDetail: m.occupationDetail,
            monthlyIncome: m.monthlyIncome,
            abroad: m.abroad || false,
            abroadCountry: m.abroadCountry,
            healthIssues: m.healthIssues,
            disabilities: m.disabilities,
            isVoter: m.isVoter || false,
            voterIdNo: m.voterIdNo,
            aadhaarNo: m.aadhaarNo,
            remarks: m.remarks,
          }))
        } : undefined
      },
      include: { members: true }
    })

    return NextResponse.json(family, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
