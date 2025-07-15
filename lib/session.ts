import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  return await getIronSession<SessionContent>(await cookies(), {
    cookieName: "session-carrot",
    password: process.env.IRON_SESSION_PASSWORD!,
  });
}
