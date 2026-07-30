import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = "imjeeva08@gmail.com";
  const rawPassword = "Jeeva08@12";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name: "Jeeva Admin",
    },
    create: {
      email,
      password: hashedPassword,
      name: "Jeeva Admin",
    },
  });

  console.log("Admin user configured successfully:", admin.email);
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
