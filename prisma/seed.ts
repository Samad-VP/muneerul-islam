import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)
  const user = await prisma.user.upsert({
    where: { email: "admin@muneerulislam.org" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@muneerulislam.org",
      password: hashedPassword,
      role: "admin",
    },
  })
  console.log("✅ Admin user created:", user.email)

  // Create Mahallu
  const mahallu = await prisma.mahallu.create({
    data: {
      name: "Muneerul Islam Mahallu",
      arabicName: "محل منیر الاسلام",
      address: "Kerala, India",
      district: "Malappuram",
      panchayat: "",
      phone: "",
      email: "info@muneerulislam.org",
      president: "",
      secretary: "",
      imam: "",
    },
  })
  console.log("✅ Mahallu created:", mahallu.name)

  // Create committees
  const committeeTypes = [
    { name: "Education Committee", type: "Education", description: "Manages educational programs and Quran classes" },
    { name: "Welfare Committee", type: "Welfare", description: "Social welfare and charity programs" },
    { name: "Youth Wing", type: "Youth", description: "Youth development and activities" },
    { name: "Women's Wing", type: "Women", description: "Women empowerment programs" },
    { name: "Finance Committee", type: "Finance", description: "Financial management and audit" },
    { name: "Maintenance Committee", type: "Maintenance", description: "Mosque maintenance and construction" },
  ]

  for (const c of committeeTypes) {
    await prisma.committee.create({
      data: { ...c, mahalluId: mahallu.id },
    })
  }
  console.log("✅ Committees created")

  // Create sample families with members
  const families = [
    {
      familyNumber: "MUI-001",
      houseName: "Baithul Rahma",
      houseNumber: "12/456",
      ward: "Ward 1",
      address: "Near Juma Masjid",
      members: [
        { name: "Mohammed Ashraf", relationToHead: "Head", gender: "Male", dob: "1975-03-15", maritalStatus: "Married", education: "Graduation", occupation: "Business", bloodGroup: "B+", phone: "9876543210", isVoter: true },
        { name: "Fathima Beevi", relationToHead: "Spouse", gender: "Female", dob: "1980-06-20", maritalStatus: "Married", education: "Plus Two", occupation: "Housewife", bloodGroup: "O+", isVoter: true },
        { name: "Ashiq Mohammed", relationToHead: "Son", gender: "Male", dob: "2002-01-10", maritalStatus: "Single", education: "Graduation", occupation: "Student", bloodGroup: "B+" },
        { name: "Ayisha Ashraf", relationToHead: "Daughter", gender: "Female", dob: "2005-08-25", maritalStatus: "Single", education: "Plus Two", occupation: "Student", bloodGroup: "O+" },
      ]
    },
    {
      familyNumber: "MUI-002",
      houseName: "Darul Salam",
      houseNumber: "14/789",
      ward: "Ward 2",
      address: "Market Road",
      members: [
        { name: "Abdul Rahman", relationToHead: "Head", gender: "Male", dob: "1968-11-05", maritalStatus: "Married", education: "SSLC", occupation: "Farming", bloodGroup: "A+", phone: "9876543211", isVoter: true },
        { name: "Sainaba", relationToHead: "Spouse", gender: "Female", dob: "1972-04-12", maritalStatus: "Married", education: "SSLC", occupation: "Housewife", bloodGroup: "A-", isVoter: true },
        { name: "Muhammed Riyas", relationToHead: "Son", gender: "Male", dob: "1995-07-30", maritalStatus: "Married", education: "Post Graduation", occupation: "Engineer", bloodGroup: "A+", abroad: true, abroadCountry: "UAE", isVoter: true },
        { name: "Amina Rahman", relationToHead: "Daughter", gender: "Female", dob: "1998-12-18", maritalStatus: "Married", education: "Graduation", occupation: "Teacher", bloodGroup: "B+" },
        { name: "Hussain Rahman", relationToHead: "Son", gender: "Male", dob: "2008-09-03", maritalStatus: "Single", education: "High School", occupation: "Student", bloodGroup: "A+" },
      ]
    },
    {
      familyNumber: "MUI-003",
      houseName: "Noor Manzil",
      houseNumber: "7/123",
      ward: "Ward 1",
      address: "School Road",
      members: [
        { name: "Ismail Haji", relationToHead: "Head", gender: "Male", dob: "1955-02-20", maritalStatus: "Married", education: "Primary", occupation: "Retired", bloodGroup: "O-", phone: "9876543212", isVoter: true },
        { name: "Khadeeja", relationToHead: "Spouse", gender: "Female", dob: "1960-09-14", maritalStatus: "Married", education: "Primary", occupation: "Housewife", bloodGroup: "O+", isVoter: true },
      ]
    },
  ]

  for (const f of families) {
    await prisma.family.upsert({
      where: { familyNumber: f.familyNumber },
      update: {},
      create: {
        familyNumber: f.familyNumber,
        houseName: f.houseName,
        houseNumber: f.houseNumber,
        ward: f.ward,
        address: f.address,
        mahalluId: mahallu.id,
        members: {
          create: f.members.map(m => ({
            name: m.name,
            relationToHead: m.relationToHead,
            gender: m.gender,
            dob: m.dob ? new Date(m.dob) : null,
            maritalStatus: m.maritalStatus,
            education: m.education,
            occupation: m.occupation,
            bloodGroup: m.bloodGroup,
            phone: m.phone || null,
            abroad: m.abroad || false,
            abroadCountry: m.abroadCountry || null,
            isVoter: m.isVoter || false,
          }))
        }
      }
    })
  }
  console.log("✅ Sample families & members created")

  // --- Finance Module Seeding ---
  // Create Funds
  const generalFund = await prisma.fund.upsert({
    where: { name: "General Fund" },
    update: {},
    create: { name: "General Fund", type: "general", description: "Main Mahallu Fund", isDefault: true, balance: 50000 }
  })
  const ramadanFund = await prisma.fund.upsert({
    where: { name: "Ramadan Relief Fund" },
    update: {},
    create: { name: "Ramadan Relief Fund", type: "special", description: "Zakat & Relief", isDefault: false, balance: 15000 }
  })
  console.log("✅ Funds created")

  // Update Families with default monthlyDueAmount
  await prisma.family.updateMany({
    data: { monthlyDueAmount: 500 }
  })
  console.log("✅ Families updated with monthly dues")

  // Create additional Admin/Committee Roles
  const rolesToCreate = [
    { email: "president@muneerulislam.org", name: "President", role: "president" },
    { email: "treasurer@muneerulislam.org", name: "Treasurer", role: "treasurer" },
    { email: "secretary@muneerulislam.org", name: "Secretary", role: "secretary" },
    { email: "dataentry@muneerulislam.org", name: "Data Entry", role: "data_entry" }
  ]
  
  for (const r of rolesToCreate) {
    await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: { name: r.name, email: r.email, password: hashedPassword, role: r.role }
    })
  }

  // Create a Family Head User linked to the first family
  const firstFamily = await prisma.family.findFirst({ where: { familyNumber: "MUI-001" } })
  if (firstFamily) {
    await prisma.user.upsert({
      where: { email: "head001@muneerulislam.org" },
      update: {},
      create: {
        name: "Family Head (Mohammed Ashraf)",
        email: "head001@muneerulislam.org",
        password: hashedPassword,
        role: "family_head",
        familyId: firstFamily.id
      }
    })
    console.log("✅ Family Head user created")
  }

  console.log("🎉 Seeding complete!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
