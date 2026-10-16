import type { Metadata } from "next";

export type SeoDefaults = {
  allowIndexing: boolean;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  defaultOgImageUrl: string | null;
} | null | undefined;

type Site = { name: string; description: string; image: string; seo: SeoDefaults };
type ArticleSeo = {
  metaTitle?: string | null; metaDescription?: string | null;
  ogTitle?: string | null; ogDescription?: string | null; ogImageUrl?: string | null;
};
type Article = { title: string; summary?: string | null; featuredImageUrl?: string | null; seo?: ArticleSeo };

const first = (...values: (string | null | undefined)[]) => values.find((value) => value?.trim())?.trim() ?? "";
const noIndex = { index: false, follow: false } as const;

export function siteMetadata(site: Site, { maintenance = false }: { maintenance?: boolean } = {}): Metadata {
  const title = first(site.seo?.metaTitle, site.name);
  const description = first(site.seo?.metaDescription, site.description, `Latest stories from ${site.name}`);
  const ogTitle = first(site.seo?.ogTitle, site.seo?.metaTitle, site.name);
  const ogDescription = first(site.seo?.ogDescription, site.seo?.metaDescription, site.description, description);
  const image = first(site.seo?.defaultOgImageUrl, site.image);
  return {
    title: maintenance ? `Maintenance | ${site.name}` : title,
    description,
    robots: maintenance || site.seo?.allowIndexing === false ? noIndex : undefined,
    openGraph: { title: ogTitle, description: ogDescription, images: image ? [image] : undefined },
  };
}

/** Article-specific SEO is optional until Article editing supports dedicated SEO fields. */
export function articleMetadata(site: Site, article: Article, { publiclyVisible = true }: { publiclyVisible?: boolean } = {}): Metadata {
  const title = first(article.seo?.metaTitle, article.title, site.seo?.metaTitle, site.name);
  const description = first(article.seo?.metaDescription, article.summary, site.seo?.metaDescription, site.description);
  const ogTitle = first(article.seo?.ogTitle, article.seo?.metaTitle, article.title, site.seo?.ogTitle, site.seo?.metaTitle, site.name);
  const ogDescription = first(article.seo?.ogDescription, article.seo?.metaDescription, article.summary,
    site.seo?.ogDescription, site.seo?.metaDescription, site.description);
  const image = first(article.seo?.ogImageUrl, article.featuredImageUrl, site.seo?.defaultOgImageUrl, site.image);
  return {
    title, description,
    robots: !publiclyVisible || site.seo?.allowIndexing === false ? noIndex : undefined,
    openGraph: { title: ogTitle, description: ogDescription, images: image ? [image] : undefined },
  };
}
