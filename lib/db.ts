import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const token = await prisma.sMSToken.findUnique({
    where: {
      id: 1,
    },
    include: {
      user: true,
    },
  });

  console.log(token);
}

test();

export default prisma;
