"use server";

import prisma from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  "use server";

  await new Promise((r) => setTimeout(r, 5000));

  const session = await getSession();
  try {
    await prisma.like.upsert({
      where: {
        id: {
          userId: session.id!,
          postId,
        },
      },
      create: {
        userId: session.id!,
        postId,
      },
      update: {},
    });

    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function dislikePost(postId: number) {
  "use server";

  await new Promise((r) => setTimeout(r, 5000));

  const session = await getSession();
  try {
    await prisma.like.deleteMany({
      where: {
        userId: session.id!,
        postId,
      },
    });

    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    console.log(e);
  }
}
