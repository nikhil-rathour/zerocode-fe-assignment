import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Test User'
    }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
