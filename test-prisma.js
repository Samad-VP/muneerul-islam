const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
async function main() {
  try {
    const m = await prisma.mahallu.findFirst()
    console.log('Mahallu:', m)
    if (!m) return console.log('No Mahallu')
    const family = await prisma.family.create({
      data: {
        familyNumber: 'TEST-1234',
        houseName: 'Test House',
        mahalluId: m.id,
        members: {
          create: [{
            name: 'Test Member',
            relationToHead: '',
            gender: 'Male',
          }]
        }
      }
    })
    console.log('Success:', family)
  } catch (e) {
    console.error('Prisma Error:', e)
  } finally {
    await prisma.$disconnect()
  }
}
main()
