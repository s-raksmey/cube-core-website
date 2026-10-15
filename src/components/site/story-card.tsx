import { ArticleShareCount } from "@/components/site/article-share-count";
import { ArticleViewCount } from "@/components/site/article-view-count";
import {
  articleHref,
  articleText,
  subcategoryName,
  type Locale,
} from "@/lib/public-locale";
import type { PublicArticleCard } from "@/types/public-content";
import { ArrowRight, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type StoryCardProps = {
  article: PublicArticleCard;
  locale: Locale;
  size?: "lead" | "feature" | "standard";
};

export function StoryCard({
  article,
  locale,
  size = "standard",
}: StoryCardProps) {
  const title = articleText(article, locale).title;
  const href = articleHref(article, locale);
  const category = subcategoryName(article.subcategory, locale);
  const published = new Date(article.publishedAt).toLocaleDateString(
    locale === "km" ? "km-KH" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <article className={`story-card story-card-${size}`}>
      <Link href={href} className="story-card-image" aria-label={title}>
        {article.featuredImageUrl ? (
          <Image
            src={article.featuredImageUrl}
            alt=""
            fill
            unoptimized
            sizes={
              size === "lead"
                ? "(max-width: 640px) 100vw, 60vw"
                : "(max-width: 640px) 100vw, 30vw"
            }
          />
        ) : (
          <span className="story-card-placeholder" />
        )}
      </Link>
      <div className="story-card-shade" />
      <span
        className={`story-card-badge ${article.isBreaking ? "story-card-badge-breaking" : ""}`}
      >
        {article.isBreaking ? (
          <>
            {locale === "km" ? "ទាន់ហេតុការណ៍" : "Breaking"}
            <span> · {category}</span>
          </>
        ) : (
          category
        )}
      </span>
      <div className="story-card-content">
        <Link href={href} className="story-card-title">
          {title}
        </Link>
        <div className="story-card-meta">
          <time dateTime={article.publishedAt}>
            <CalendarDays aria-hidden="true" />
            {published}
          </time>
          <ArticleViewCount count={article.viewCount} locale={locale} compact />
          <ArticleShareCount
            count={article.shareCount}
            locale={locale}
            compact
          />
        </div>
      </div>
      <Link
        href={href}
        className="story-card-arrow"
        aria-label={`${locale === "km" ? "អាន" : "Read"}: ${title}`}
      >
        <ArrowRight aria-hidden="true" />
      </Link>
    </article>
  );
}
