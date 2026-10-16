import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoryArchive } from "@/components/site/story-archive";
import { StoryRouteLoading } from "@/components/site/story-route-loading";
import { getArticles, getCategories } from "@/lib/public-content";
import { categoryName } from "@/lib/public-locale";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";
import { TenantWebsiteMaintenance } from "@/components/tenant-website-maintenance";
import { RequestTimeMarker } from "@/components/site/request-time-marker";

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default function CategoryPage({ params, searchParams }: Props) {
  return <><RequestTimeMarker /><Suspense fallback={<StoryRouteLoading />}><CategoryStories params={params} searchParams={searchParams} /></Suspense></>;
}

async function CategoryStories({ params, searchParams }: Props) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  if (tenant.generalSettings?.website.maintenanceMode) return <TenantWebsiteMaintenance siteName={tenant.generalSettings.siteName} message={tenant.generalSettings.website.maintenanceMessage} locale={await getSiteLocale()} />;
  const [{ category: slug }, query, locale, categories] = await Promise.all([params, searchParams, getSiteLocale(), getCategories(tenant.id)]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = Math.max(1, Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1));
  const articles = await getArticles({ tenantId: tenant.id, categorySlug: slug, page, pageSize: 12 });
  return <StoryArchive title={categoryName(category, locale)} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} path={`/${slug}`} locale={locale} />;
}
