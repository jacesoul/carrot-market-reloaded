import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }

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
  const data = await response.json();

  if ("error" in data) {
    return new Response(null, { status: 400 });
  }

  return Response.json(data);
}
