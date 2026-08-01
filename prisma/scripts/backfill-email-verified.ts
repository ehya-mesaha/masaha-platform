import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../src/generated/prisma'

// One-time backfill: mark every pre-existing account as email-verified so the
// new login gate (added alongside email confirmation for signups) doesn't
// lock out anyone who registered before this feature shipped.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const updatedCount = await prisma.$executeRawUnsafe(
    'UPDATE "User" SET "emailVerifiedAt" = "createdAt" WHERE "emailVerifiedAt" IS NULL'
  )
  console.log('Backfilled emailVerifiedAt for existing users:', updatedCount)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
