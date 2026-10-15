import type {
  PublicArticle,
  PublicArticleCard,
  PublicArticleSummary,
  PublicCategory,
} from "@/types/public-content";

export type Locale = "en" | "km";
export const hrefFor = (path: string, locale: Locale) =>
  `/${locale}${path === "/" ? "" : path}`;

export function categoryName(
  category: Pick<PublicCategory, "name" | "translations">,
  locale: Locale,
) {
  return locale === "km"
    ? (category.translations.find((item) => item.locale === "km")?.name ??
        category.name)
    : category.name;
}

export function subcategoryName(
  subcategory: Pick<
    PublicArticleSummary["subcategory"],
    "slug" | "translations"
  >,
  locale: Locale,
) {
  return (
    subcategory.translations.find((item) => item.locale === locale)?.name ??
    subcategory.translations.find((item) => item.locale === "en")?.name ??
    subcategory.slug.replaceAll("-", " ")
  );
}

export function articleText(
  article:
    | Pick<PublicArticleCard, "title" | "summary" | "translations">
    | PublicArticle,
  locale: Locale,
) {
  const translation =
    locale === "km"
      ? article.translations.find((item) => item.locale === "km")
      : null;
  return {
    title: translation?.title ?? article.title,
    summary: translation?.summary ?? article.summary,
  };
}

export function articleContent(article: PublicArticle, locale: Locale) {
  return locale === "km"
    ? (article.translations.find((item) => item.locale === "km")?.content ??
        article.content)
    : article.content;
}

export const articleHref = (
  article: Pick<PublicArticleSummary, "category" | "subcategorySlug" | "slug">,
  locale: Locale,
) =>
  hrefFor(
    `/${article.category.slug}/${article.subcategorySlug}/${article.slug}`,
    locale,
  );
