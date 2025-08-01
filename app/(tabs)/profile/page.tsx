import prisma from "@/lib/db";
import getSession from "@/lib/session";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

async function getUser() {
  const session = await getSession();

  if (session.id) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
    });

    if (user) {
      return user;
    }
  }

  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const user = await getUser();
  return <h1>Welcome! {user?.username}</h1>;
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";

    const session = await getSession();
    await session.destroy();
    redirect("/login");
  };

  if (!user) {
    return (
      <div>
        <h1>You are not logged in</h1>
        <Link href="/login">Login</Link>
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Username />
      </Suspense>
      <form action={logOut}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
