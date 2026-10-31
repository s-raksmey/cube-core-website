import { ArticleThumbnail } from "@/components/site/article-thumbnail";
import { ArticleImage } from "@/components/site/article-image";
import { articleHref, articleText, categoryName, type Locale } from "@/lib/public-locale";
import type { PublicFeaturedArticle } from "@/types/public-content";
import Link from "next/link";

export function SiteHero({ articles, headlines, locale }: {
  articles: PublicFeaturedArticle[];
  headlines: PublicFeaturedArticle[];
  locale: Locale;
}) {
  const [lead] = articles;
  if (!lead) return null;
  const copy = articleText(lead, locale);
  const featuredLabel = locale === "km" ? "ព័ត៌មានពិសេស" : "Featured News";

  return (
    <section aria-label={featuredLabel} className="border-b border-border pb-6">
      <div className={`grid min-w-0 gap-6 md:gap-7 ${headlines.length ? "md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]" : ""}`}>
        <article className="min-w-0">
          <Link href={articleHref(lead, locale)} className="group block rounded-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            <div className="relative aspect-video w-full overflow-hidden rounded-none bg-muted">
              <ArticleImage src={lead.featuredImageUrl} preload sizes="(max-width: 767px) 100vw, (max-width: 1023px) 54vw, (max-width: 1720px) 65vw, 1080px" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">{categoryName(lead.category, locale)}</span>
            </div>
            <h1 className={`mt-3 line-clamp-3 text-pretty text-2xl font-bold wrap-anywhere text-foreground group-hover:text-primary sm:text-3xl ${locale === "km" ? "leading-relaxed" : "leading-snug"}`}>{copy.title}</h1>
            {copy.summary ? <p className="mt-3 line-clamp-3 text-pretty text-sm leading-7 wrap-anywhere text-muted-foreground sm:text-base">{copy.summary}</p> : null}
          </Link>
        </article>
        {headlines.length ? (
          <aside className="min-w-0 md:border-l md:border-border md:pl-6">
            <h2 className="border-b-2 border-primary pb-3 text-lg font-bold leading-relaxed text-foreground">{locale === "km" ? "ព័ត៌មានសំខាន់ៗ" : "Top Headlines"}</h2>
            <div className="divide-y divide-border">
              {headlines.slice(0, 4).map((article) => (
                <article key={article.id}>
                  <Link href={articleHref(article, locale)} className="group grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    <div className="min-w-0">
                      <span className="text-xs font-bold leading-relaxed text-primary">{categoryName(article.category, locale)}</span>
                      <h3 className={`mt-2 line-clamp-2 text-base font-bold wrap-anywhere text-foreground group-hover:text-primary ${locale === "km" ? "leading-relaxed" : "leading-snug"}`}>{articleText(article, locale).title}</h3>
                    </div>
                    <ArticleThumbnail src={article.featuredImageUrl} className="md:translate-y-7 lg:translate-y-0" />
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
