import { notFound } from "next/navigation";
import { StoryArchive } from "@/components/site/story-archive";
import { getArticles, getCategories } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";

export default async function TopicPage({ params, searchParams }: {
  params: Promise<{ category: string; topic: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [{ category: categorySlug, topic: topicSlug }, query, locale, categories] = await Promise.all([params, searchParams, getSiteLocale(), getCategories(tenant.id)]);
  const category = categories.find((item) => item.slug === categorySlug);
  const topic = category?.subcategories.find((item) => item.slug === topicSlug);
  if (!category || !topic) notFound();
  const title = topic.translations.find((item) => item.locale === locale)?.name ?? topic.translations.find((item) => item.locale === "en")?.name ?? topic.slug.replaceAll("-", " ");
  const page = Math.max(1, Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1));
  const articles = await getArticles({ tenantId: tenant.id, categorySlug, subcategorySlug: topicSlug, page, pageSize: 12 });
  return <StoryArchive title={title} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} path={`/${categorySlug}/${topicSlug}`} locale={locale} />;
}
