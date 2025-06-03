import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.findMany({
    where: {
      username: "test",
    },
  });

  console.log(users);
}

test();

export default prisma;
