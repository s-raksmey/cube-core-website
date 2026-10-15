import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const localePrefix = /^\/(en|km)(?=\/|$)/;

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const match = url.pathname.match(localePrefix);

  if (!match) {
    const legacyLocale = url.searchParams.get("lang");
    const locale = legacyLocale === "en" ? "en" : "km";
    url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;
    url.searchParams.delete("lang");
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", match[1]);
  url.pathname = url.pathname.slice(match[0].length) || "/";
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: "/((?!_next/|tenant-assets/|.*\\..*).*)",
};
