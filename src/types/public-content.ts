import type { PublicWebsiteArticlesQuery, PublicWebsiteCategoriesQuery, PublicWebsiteArticleQuery, PublicWebsiteTagsQuery } from "@/lib/apollo/generated/graphql";

export type PublicCategory = PublicWebsiteCategoriesQuery["publicWebsiteCategories"][number];
export type PublicArticleSummary = PublicWebsiteArticlesQuery["publicWebsiteArticles"]["items"][number];
export type PublicArticle = NonNullable<PublicWebsiteArticleQuery["publicWebsiteArticle"]>;
export type PublicTag = PublicWebsiteTagsQuery["publicWebsiteTags"][number];
