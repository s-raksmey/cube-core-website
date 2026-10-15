import { StoryArchive } from "@/components/site/story-archive";
import { StoryRouteLoading } from "@/components/site/story-route-loading";
import { Suspense } from "react";
import { getArticles } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export default function SearchPage({ searchParams }: Props) {
  return <Suspense fallback={<StoryRouteLoading />}><SearchStories searchParams={searchParams} /></Suspense>;
}

async function SearchStories({ searchParams }: Props) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [params, locale] = await Promise.all([searchParams, getSiteLocale()]);
  const query = (params.q ?? "").trim().slice(0, 160);
  const page = Math.max(1, Math.min(100000, Number.parseInt(params.page ?? "1", 10) || 1));
  const articles = query ? await getArticles({ tenantId: tenant.id, search: query, page, pageSize: 12 }) : { items: [], total: 0, page, pageSize: 12 };
  return <StoryArchive title={locale === "km" ? "ស្វែងរក" : "Search"} description={query ? `Results for “${query}”` : "Enter a search term using the search button above."} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} path={`/search?q=${encodeURIComponent(query)}`} locale={locale} />;
}
