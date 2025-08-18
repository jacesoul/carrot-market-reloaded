"use server";

import prisma from "@/lib/db";
import getSession from "@/lib/session";

export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();

  await prisma.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: { id: true },
  });
}
