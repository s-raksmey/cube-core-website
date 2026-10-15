import "server-only";

import { print } from "graphql";
import {
  PublicWebsiteArticleDocument,
  PublicWebsiteArticlesDocument,
  PublicWebsiteCategoriesDocument,
  PublicWebsiteTagsDocument,
  type PublicWebsiteArticleQuery,
  type PublicWebsiteArticleQueryVariables,
  type PublicWebsiteArticlesQuery,
  type PublicWebsiteArticlesQueryVariables,
  type PublicWebsiteCategoriesQuery,
  type PublicWebsiteTagsQuery,
} from "@/lib/apollo/generated/graphql";

async function request<T>(document: Parameters<typeof print>[0], variables: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: print(document), variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Public content is unavailable");
  const result = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (!result.data || result.errors?.length) throw new Error("Public content is unavailable");
  return result.data;
}

export async function getCategories(tenantId: string) {
  return (await request<PublicWebsiteCategoriesQuery>(PublicWebsiteCategoriesDocument, { tenantId })).publicWebsiteCategories;
}

export async function getTags(tenantId: string) {
  return (await request<PublicWebsiteTagsQuery>(PublicWebsiteTagsDocument, { tenantId })).publicWebsiteTags;
}

export async function getArticles(variables: PublicWebsiteArticlesQueryVariables) {
  return (await request<PublicWebsiteArticlesQuery>(PublicWebsiteArticlesDocument, variables)).publicWebsiteArticles;
}

export async function getArticle(variables: PublicWebsiteArticleQueryVariables) {
  return (await request<PublicWebsiteArticleQuery>(PublicWebsiteArticleDocument, variables)).publicWebsiteArticle;
}
