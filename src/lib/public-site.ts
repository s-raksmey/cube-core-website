import "server-only";

import type { Locale } from "@/lib/public-locale";
import {
  hostnameFromHostHeader,
  resolveLocalDevelopmentTenant,
  resolvePublicTenant,
} from "@/lib/tenant-resolution";
import { headers } from "next/headers";
import { cache } from "react";

export const getPublicTenant = cache(async () => {
  const hostname = hostnameFromHostHeader((await headers()).get("host"));
  try {
    if (process.env.NODE_ENV !== "production" && hostname === "localhost") {
      return await resolveLocalDevelopmentTenant();
    }
    if (!hostname) return null;
    const tenant = await resolvePublicTenant(hostname);
    return tenant?.status === "ACTIVE" ? tenant : null;
  } catch {
    return null;
  }
});

export function publicAssetUrl(path: string | null | undefined) {
  if (!path || !path.startsWith("/storage/")) return null;
  return `/tenant-assets/${path.slice("/storage/".length)}`;
}

export async function getSiteLocale(): Promise<Locale> {
  return (await headers()).get("x-site-locale") === "en" ? "en" : "km";
}
