"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";
import { ArrowUpCircleIcon } from "@heroicons/react/16/solid";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpb3dtZGptbXludG5jYXR3Y3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0NzA0MDAsImV4cCI6MjA3MTA0NjQwMH0.4tu5MOgBMHFIzcFbqSr8qk97pkfjd6LzHSVhd6CJMlE";
const SUPABASE_URL = "https://aiowmdjmmyntncatwcye.supabase.co";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    setMessage(value);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "string",
        },
      },
    ]);

    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    const channel = client.channel(`room-${chatRoomId}`);

    channel.on("broadcast", { event: "message" }, (payload) => {
      console.log(payload);
    });
  }, [chatRoomId]);

  return (
    <div className="flex p-5 flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-9 rounded-full"
            />
          )}

          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={` p-2.5 rounded-md ${
                message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              }`}
            >
              {message.payload}
            </span>
            <span className="text-sm">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form onSubmit={onSubmit} className="flex relative">
        <input
          value={message}
          onChange={onChange}
          placeholder="메시지를 입력하세요..."
          className="w-full px-5 ring-2 focus:outline-none focus:ring-3 transition ring-neutral-200 focus:ring-neutral-50 border-none text-neutral-400 rounded-full bg-transparent h-10"
        />
        <button type="submit" className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
