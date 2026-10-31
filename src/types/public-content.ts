import type {
  PublicWebsiteArticleQuery,
  PublicWebsiteFeaturedArticlesQuery,
  PublicWebsiteArticlesQuery,
  PublicWebsiteCategoriesQuery,
  PublicWebsiteTagsQuery,
} from "@/lib/apollo/generated/graphql";

export type PublicCategory =
  PublicWebsiteCategoriesQuery["publicWebsiteCategories"][number];
export type PublicArticleSummary =
  PublicWebsiteArticlesQuery["publicWebsiteArticles"]["items"][number];
export type PublicArticleCard = Omit<PublicArticleSummary, "isFeatured">;
export type PublicArticle = NonNullable<
  PublicWebsiteArticleQuery["publicWebsiteArticle"]
>;
export type PublicTag = PublicWebsiteTagsQuery["publicWebsiteTags"][number];

export type PublicFeaturedArticle = PublicWebsiteFeaturedArticlesQuery["publicWebsiteArticles"]["items"][number];
