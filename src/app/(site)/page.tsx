import Link from "next/link";
import Image from "next/image";
import { getArticles, getCategories, getPopularArticles } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";
import { articleHref, articleText, categoryName, hrefFor, subcategoryName } from "@/lib/public-locale";
import { Flame } from "lucide-react";
import { StoryCard } from "@/components/site/story-card";
import { ArticleViewCount } from "@/components/site/article-view-count";
import { ArticleShareCount } from "@/components/site/article-share-count";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteHero } from "@/components/site/site-hero";
import { TenantWebsiteMaintenance } from "@/components/tenant-website-maintenance";
import { RequestTimeMarker } from "@/components/site/request-time-marker";
import { Suspense } from "react";

export default function HomePage() {
  return <><RequestTimeMarker /><Suspense fallback={null}><HomeContent /></Suspense></>;
}

async function HomeContent() {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const locale = await getSiteLocale();
  if (tenant.generalSettings?.website.maintenanceMode) return <TenantWebsiteMaintenance siteName={tenant.generalSettings.siteName} message={tenant.generalSettings.website.maintenanceMessage} locale={locale} />;
  let content;
  try {
    const [latest, featured, popular, categories] = await Promise.all([
      getArticles({ tenantId: tenant.id, pageSize: 12 }),
      getArticles({ tenantId: tenant.id, featured: true, pageSize: 4 }),
      getPopularArticles({ tenantId: tenant.id, limit: 4 }),
      getCategories(tenant.id),
    ]);
    const sections = await Promise.all(categories.slice(0, 8).map(async (category) => ({
      category,
      articles: (await getArticles({ tenantId: tenant.id, categorySlug: category.slug, pageSize: 4 })).items,
    })));
    content = { latest: latest.items, featured: featured.items, popular, sections };
  } catch {
    return <main className="site-shell py-20 text-center text-slate-600 dark:text-slate-300">Stories are temporarily unavailable.</main>;
  }
  const lead = content.latest[0] ?? content.featured[0];
  const supporting = content.latest.filter((article) => article.id !== lead?.id).slice(0, 2);
  const popular = content.popular;
  return <main className="news-home">
    <SiteHero name={tenant.generalSettings?.siteName || tenant.name}
      description={tenant.generalSettings?.siteDescription ?? ""} slides={content.featured} locale={locale} />
    <div className="news-home-shell">
      <div className={`news-home-top ${popular.length ? "" : "news-home-top-empty"}`}>
        <section>
          {lead ? <SectionHeading title={locale === "km" ? "ព័ត៌មានថ្មីៗ" : "Latest News"} /> : null}
          {lead ? <div className={`news-feature-grid ${supporting.length ? "" : "news-feature-grid-single"}`}>
            <StoryCard article={lead} locale={locale} size="lead" />
            {supporting.length ? <div className={`news-feature-stack ${supporting.length === 1 ? "news-feature-stack-single" : ""}`}>{supporting.map((article) => <StoryCard key={article.id} article={article} locale={locale} size="feature" />)}</div> : null}
          </div> : <div className="news-empty"><h2>{locale === "km" ? "មិនទាន់មានព័ត៌មានផ្សាយ" : "No published stories yet"}</h2><p>{locale === "km" ? "សូមត្រឡប់មកវិញពេលក្រោយ។" : "Check back for new stories soon."}</p></div>}
        </section>
        {popular.length ? <aside><div className="news-popular-heading"><Flame className="size-6 fill-red-500 text-red-500" aria-hidden="true" /><h2>{locale === "km" ? "ព័ត៌មានពេញនិយម" : "Popular News"}</h2></div>
          <div className="news-trending-list">{popular.slice(0, 4).map((article) => <article key={article.id} className="news-trending-item">
            <Link href={articleHref(article, locale)} className="relative block aspect-[1.12] overflow-hidden bg-slate-200">{article.featuredImageUrl ? <Image src={article.featuredImageUrl} alt="" fill unoptimized sizes="(max-width: 768px) 35vw, 120px" className="object-cover transition-transform duration-500 hover:scale-105" /> : <span className="story-card-placeholder" />}</Link>
            <div className="flex min-w-0 flex-col items-start gap-1"><span className="bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">{subcategoryName(article.subcategory, locale)}</span><Link href={articleHref(article, locale)} className="line-clamp-2 text-sm font-bold leading-snug text-[#122149] hover:text-blue-600 dark:text-white">{articleText(article, locale).title}</Link><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400"><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</time><ArticleViewCount count={article.viewCount} locale={locale} compact /><ArticleShareCount count={article.shareCount} locale={locale} compact /></div></div>
          </article>)}</div>
        </aside> : null}
      </div>
      <div className="news-category-sections">{content.sections.filter((section) => section.articles.length).map((section) => <section key={section.category.id}>
        <SectionHeading title={categoryName(section.category, locale)} href={hrefFor(`/${section.category.slug}`, locale)} actionLabel={locale === "km" ? "មើលទាំងអស់" : "View all"} />
        <div className="news-category-grid">{section.articles.map((article) => <StoryCard key={article.id} article={article} locale={locale} />)}</div>
      </section>)}</div>
    </div>
  </main>;
}
