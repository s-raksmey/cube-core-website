import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, UserRound } from "lucide-react";
import { ArticleMarkdown } from "@/components/site/article-markdown";
import { SectionHeading } from "@/components/site/section-heading";
import { StoryCard } from "@/components/site/story-card";
import { ArticleViewTracker } from "@/components/site/article-view-tracker";
import { ArticleShareControls } from "@/components/site/article-share-controls";
import { StoryRouteLoading } from "@/components/site/story-route-loading";
import { getArticle, getRelatedArticles } from "@/lib/public-content";
import { articleContent, articleText, categoryName, hrefFor, subcategoryName } from "@/lib/public-locale";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";

type Props = { params: Promise<{ category: string; topic: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [tenant, { category, topic, slug }] = await Promise.all([getPublicTenant(), params]);
  if (!tenant) return {};
  const article = await getArticle({ tenantId: tenant.id, slug }).catch(() => null);
  if (!article || article.category.slug !== category || article.subcategorySlug !== topic) return {};
  return { title: `${article.title} | ${tenant.name}`, description: article.summary ?? undefined,
    openGraph: article.featuredImageUrl ? { images: [article.featuredImageUrl] } : undefined };
}

export default function ArticlePage({ params }: Props) {
  return <Suspense fallback={<StoryRouteLoading />}><ArticleStory params={params} /></Suspense>;
}

async function ArticleStory({ params }: Props) {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [{ category, topic, slug }, locale] = await Promise.all([params, getSiteLocale()]);
  const article = await getArticle({ tenantId: tenant.id, slug });
  if (!article || article.category.slug !== category || article.subcategorySlug !== topic) notFound();
  const related = await getRelatedArticles({ tenantId: tenant.id, slug, limit: 4 });
  const text = articleText(article, locale);
  return <main className="site-shell flex-1 py-7 pb-16">
    <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb"><Link href={hrefFor("/", locale)} className="hover:text-blue-600">{locale === "km" ? "ទំព័រដើម" : "Home"}</Link><span className="mx-2">/</span><Link href={hrefFor(`/${category}`, locale)} className="hover:text-blue-600">{categoryName(article.category, locale)}</Link><span className="mx-2">/</span><Link href={hrefFor(`/${category}/${topic}`, locale)} className="hover:text-blue-600">{subcategoryName(article.subcategory, locale)}</Link><span className="mx-2">/</span><span aria-current="page" className="text-slate-900 dark:text-white">{text.title}</span></nav>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,2.8fr)_minmax(260px,1fr)]">
      <article className="min-w-0">
        <div className="mb-4 flex items-center gap-2"><span className="bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{subcategoryName(article.subcategory, locale)}</span>{article.isBreaking ? <span className="bg-destructive px-3 py-1 text-xs font-bold text-white">Breaking</span> : null}</div>
        <h1 className="text-3xl font-black leading-tight tracking-tight text-[#101d48] dark:text-white sm:text-4xl lg:text-5xl">{text.title}</h1>
        {text.summary ? <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">{text.summary}</p> : null}
        <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-5 text-sm text-slate-500 dark:border-slate-800"><span className="inline-flex items-center gap-1"><CalendarDays className="size-4" />{new Date(article.publishedAt).toLocaleDateString(locale === "km" ? "km-KH" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span><ArticleViewTracker key={article.id} articleId={article.id} initialCount={article.viewCount} locale={locale} />{article.authorName ? <span className="inline-flex items-center gap-1"><UserRound className="size-4" />{article.authorName}</span> : null}</div>
        {article.featuredImageUrl ? <div className="relative mt-6 aspect-video overflow-hidden rounded-lg bg-slate-900"><Image src={article.featuredImageUrl} alt="" fill unoptimized priority sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover" /></div> : null}
        <div className="mt-8"><ArticleMarkdown content={articleContent(article, locale)} /></div>
        {article.tags.length ? <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-5 dark:border-slate-800">{article.tags.map((tag) => <Link key={tag.slug} href={hrefFor(`/tags/${tag.slug}`, locale)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300">#{locale === "km" ? tag.translations.find((item) => item.locale === "km")?.name ?? tag.name : tag.name}</Link>)}</div> : null}
        <ArticleShareControls key={`share-${article.id}`} articleId={article.id} title={text.title} initialCount={article.shareCount} locale={locale} />
      </article>
      <aside><SectionHeading title={locale === "km" ? "ព័ត៌មានពាក់ព័ន្ធ" : "Related News"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{related.map((item) => <StoryCard key={item.id} article={item} locale={locale} />)}</div>
      </aside>
    </div>
  </main>;
}
