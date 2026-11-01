"use server";

import { getArticles } from "@/lib/public-content";
import { getPublicTenant } from "@/lib/public-site";

export async function searchArticlePreview(query: string) {
  if (typeof query !== "string") return [];
  const search = query.trim();
  if (search.length < 3 || search.length > 160) return [];
  const tenant = await getPublicTenant();
  if (!tenant || tenant.generalSettings?.website.maintenanceMode) return [];
  return (await getArticles({ tenantId: tenant.id, search, pageSize: 6 })).items;
}
