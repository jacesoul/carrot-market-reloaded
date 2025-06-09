import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  console.log("Hello!!!");
  const pathName = request.nextUrl.pathname;
  if (pathName === "/") {
    const response = NextResponse.next();
    response.cookies.set("middleware-cookie", "hello");

    return response;
  }

  //   const session = await getSession();
  //   console.log(session);
  if (request.nextUrl.pathname === "/profile") {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
