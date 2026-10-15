import { StoryArchive } from "@/components/site/story-archive";
import { notFound } from "next/navigation";
import { getArticles, getTags } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";

export default async function TagPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [{ slug }, query, locale] = await Promise.all([params, searchParams, getSiteLocale()]);
  if (slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) notFound();
  const page = Math.max(1, Math.min(100000, Number.parseInt(query.page ?? "1", 10) || 1));
  const [articles, tags] = await Promise.all([
    getArticles({ tenantId: tenant.id, tagSlug: slug, page, pageSize: 12 }),
    getTags(tenant.id),
  ]);
  const tag = tags.find((item) => item.slug === slug);
  if (!tag) notFound();
  const name = locale === "km" ? tag.translations.find((item) => item.locale === "km")?.name ?? tag.name : tag.name;
  return <StoryArchive title={`#${name}`} articles={articles.items} total={articles.total} page={articles.page} pageSize={articles.pageSize} path={`/tags/${slug}`} locale={locale} />;
}
