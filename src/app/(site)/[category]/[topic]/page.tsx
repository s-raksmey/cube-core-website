import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoryArchive } from "@/components/site/story-archive";
import { StoryRouteLoading } from "@/components/site/story-route-loading";
import { getArticles, getCategories } from "@/lib/public-content";
import { categoryName, subcategoryName } from "@/lib/public-locale";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";

type Props = {
  params: Promise<{ category: string; topic: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default function TopicPage({ params, searchParams }: Props) {
  return <Suspense fallback={<StoryRouteLoading />}><TopicStories params={params} searchParams={searchParams} /></Suspense>;
}

async function TopicStories({ params, searchParams }: Props) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [{ category: categorySlug, topic: topicSlug }, query, locale, categories] = await Promise.all([params, searchParams, getSiteLocale(), getCategories(tenant.id)]);
  const category = categories.find((item) => item.slug === categorySlug);
  const topic = category?.subcategories.find((item) => item.slug === topicSlug);
  if (!category || !topic) notFound();
  const title = subcategoryName(topic, locale);
  const page = Math.max(1, Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1));
  const articles = await getArticles({ tenantId: tenant.id, categorySlug, subcategorySlug: topicSlug, page, pageSize: 12 });
  return <StoryArchive title={title} parent={{ title: categoryName(category, locale), path: `/${categorySlug}` }} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} path={`/${categorySlug}/${topicSlug}`} locale={locale} />;
}
