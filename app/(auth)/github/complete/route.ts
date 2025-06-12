import prisma from "@/lib/db";
import getSession from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

async function getAccessToken(code: string): Promise<string | null> {
  const accessTokenURL = "https://github.com/login/oauth/access_token";
  const accessTokenParams = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  };

  const queryString = new URLSearchParams(accessTokenParams).toString();
  const url = `${accessTokenURL}?${queryString}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const { access_token, error } = await response.json();

  if (error) return null;

  return access_token;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, { status: 400 });
  }

  const access_token = await getAccessToken(code);
  if (!access_token) {
    return new Response(null, { status: 400 });
  }

  const userInfoURL = "https://api.github.com/user";
  const userInfoResponse = await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });

  const { id, avatar_url, login } = await userInfoResponse.json();

  const user = await prisma.user.findUnique({
    where: {
      github_id: String(id),
    },
    select: {
      id: true,
    },
  });

  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();

    return NextResponse.redirect(new URL("/profile", request.url));
  }

  const newUser = await prisma.user.create({
    data: {
      username: `${login}_${id}`,
      github_id: String(id),
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });

  const session = await getSession();
  session.id = newUser.id;
  await session.save();

  return NextResponse.redirect(new URL("/profile", request.url));
}
