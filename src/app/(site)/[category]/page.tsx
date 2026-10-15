import { notFound } from "next/navigation";
import { StoryArchive } from "@/components/site/story-archive";
import { getArticles, getCategories } from "@/lib/public-content";
import { categoryName } from "@/lib/public-locale";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [{ category: slug }, query, locale, categories] = await Promise.all([params, searchParams, getSiteLocale(), getCategories(tenant.id)]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const page = Math.max(1, Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1));
  const articles = await getArticles({ tenantId: tenant.id, categorySlug: slug, page, pageSize: 12 });
  return <StoryArchive title={categoryName(category, locale)} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} path={`/${slug}`} locale={locale} />;
}
