import prisma from "@/lib/db";
import getSession from "@/lib/session";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

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
      <h1>Welcome! {user.username}</h1>
      <form action={logOut}>
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
