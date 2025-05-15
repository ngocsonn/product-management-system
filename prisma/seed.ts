import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const data = [
  {
    email: 'user-01@gmail.com',
    name: 'user 01',
  },
  {
    email: 'user-02@gmail.com',
    name: 'user 02',
  },
  {
    email: 'user-03@gmail.com',
    name: 'user 03',
  },
  {
    email: 'user-04@gmail.com',
    name: 'user 04',
  },
  {
    email: 'user-05@gmail.com',
    name: 'user 05',
  },
];
async function main() {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash('pass', salt);

  for (const user of data) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashedPassword },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
