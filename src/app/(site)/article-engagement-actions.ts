"use server";

import { randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { recordArticleShare, recordArticleView } from "@/lib/public-content";
import { hostnameFromHostHeader } from "@/lib/tenant-resolution";
import type { ArticleSharePlatform } from "@/lib/apollo/generated/graphql";

const VISITOR_COOKIE = "cube_public_visitor";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function visitorContext() {
  const hostname = hostnameFromHostHeader((await headers()).get("host"));
  if (!hostname) return null;
  const cookieStore = await cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;
  const visitorId = existing && UUID_PATTERN.test(existing) ? existing : randomUUID();
  if (visitorId !== existing) {
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: 60 * 60 * 24 * 365,
    });
  }
  return { hostname, visitorId };
}

export async function recordArticleVisit(articleId: string): Promise<boolean> {
  if (!UUID_PATTERN.test(articleId)) return false;
  const context = await visitorContext();
  if (!context) return false;
  try {
    return await recordArticleView({ ...context, articleId });
  } catch {
    // Analytics must not interrupt reading a public article.
    return false;
  }
}

const SHARE_PLATFORMS: ArticleSharePlatform[] = ["FACEBOOK", "TELEGRAM", "COPY_LINK", "NATIVE"];

export async function recordArticleShareAction(articleId: string, platform: ArticleSharePlatform): Promise<boolean> {
  if (!UUID_PATTERN.test(articleId) || !SHARE_PLATFORMS.includes(platform)) return false;
  try {
    const context = await visitorContext();
    if (!context) return false;
    return await recordArticleShare({ ...context, articleId, platform });
  } catch {
    // Sharing must still work if analytics is unavailable.
    return false;
  }
}
