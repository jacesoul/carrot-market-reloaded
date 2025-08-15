import ChatMessagesList from "@/components/chat-messages-list";
import prisma from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await prisma.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });

  if (room) {
    const session = await getSession();

    const canSee = Boolean(room.users.find((user) => user.id === session.id));

    if (!canSee) {
      return null;
    }
  }

  return room;
}

async function getMessage(chatRoomId: string) {
  const messages = await prisma.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
}

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessage>;

export default async function ChatRoom({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = await getRoom(id);

  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessage(id);
  const session = await getSession();

  return (
    <ChatMessagesList userId={session.id!} initialMessages={initialMessages} />
  );
}
