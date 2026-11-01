import { SearchResults } from "@/components/site/search-results";
import { StoryRouteLoading } from "@/components/site/story-route-loading";
import { Suspense } from "react";
import { getArticles, getCategories } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";
import { TenantWebsiteMaintenance } from "@/components/tenant-website-maintenance";
import { RequestTimeMarker } from "@/components/site/request-time-marker";

type Props = { searchParams: Promise<{ q?: string | string[]; category?: string | string[]; page?: string | string[] }> };

export default function SearchPage({ searchParams }: Props) {
  return <><RequestTimeMarker /><Suspense fallback={<StoryRouteLoading />}><SearchStories searchParams={searchParams} /></Suspense></>;
}

async function SearchStories({ searchParams }: Props) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [params, locale] = await Promise.all([searchParams, getSiteLocale()]);
  if (tenant.generalSettings?.website.maintenanceMode) return <TenantWebsiteMaintenance siteName={tenant.generalSettings.siteName} message={tenant.generalSettings.website.maintenanceMessage} locale={locale} />;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const category = typeof params.category === "string" ? params.category : "";
  const categories = await getCategories(tenant.id).catch(() => []);
  const page = Number(typeof params.page === "string" ? params.page : "1");
  let error = Array.isArray(params.q) || Array.isArray(params.page) || Array.isArray(params.category) ? "Invalid search parameters." : query.length > 160 ? "Search must be 160 characters or fewer." : !Number.isInteger(page) || page < 1 || page > 100000 ? "Invalid search page." : undefined;
  let articles: Awaited<ReturnType<typeof getArticles>> = { items: [], total: 0, page: Number.isInteger(page) && page > 0 ? page : 1, pageSize: 12 };
  if ((query || category) && !error) {
    try { articles = await getArticles({ tenantId: tenant.id, search: query, categorySlug: category || null, page, pageSize: 12 }); }
    catch { error = "Search is unavailable. Please try again."; }
  }
  return <SearchResults query={query} category={category} categories={categories} error={error} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} locale={locale} />;
}
