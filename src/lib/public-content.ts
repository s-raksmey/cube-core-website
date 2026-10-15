import "server-only";

import {
  PublicWebsiteArticleDocument,
  PublicWebsiteArticlesDocument,
  PublicWebsiteCategoriesDocument,
  PublicWebsitePopularArticlesDocument,
  PublicWebsiteRelatedArticlesDocument,
  PublicWebsiteTagsDocument,
  RecordPublicWebsiteArticleShareDocument,
  RecordPublicWebsiteArticleViewDocument,
  type PublicWebsiteArticleQuery,
  type PublicWebsiteArticleQueryVariables,
  type PublicWebsiteArticlesQuery,
  type PublicWebsiteArticlesQueryVariables,
  type PublicWebsiteCategoriesQuery,
  type PublicWebsitePopularArticlesQuery,
  type PublicWebsitePopularArticlesQueryVariables,
  type PublicWebsiteRelatedArticlesQuery,
  type PublicWebsiteRelatedArticlesQueryVariables,
  type PublicWebsiteTagsQuery,
  type RecordPublicWebsiteArticleShareMutation,
  type RecordPublicWebsiteArticleShareMutationVariables,
  type RecordPublicWebsiteArticleViewMutation,
  type RecordPublicWebsiteArticleViewMutationVariables,
} from "@/lib/apollo/generated/graphql";
import { print } from "graphql";

async function request<T>(
  document: Parameters<typeof print>[0],
  variables: Record<string, unknown>,
): Promise<T> {
  const endpoint =
    process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: print(document), variables }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Public content is unavailable");
  const result = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (!result.data || result.errors?.length)
    throw new Error("Public content is unavailable");
  return result.data;
}

export async function getCategories(tenantId: string) {
  return (
    await request<PublicWebsiteCategoriesQuery>(
      PublicWebsiteCategoriesDocument,
      { tenantId },
    )
  ).publicWebsiteCategories;
}

export async function getTags(tenantId: string) {
  return (
    await request<PublicWebsiteTagsQuery>(PublicWebsiteTagsDocument, {
      tenantId,
    })
  ).publicWebsiteTags;
}

export async function getArticles(
  variables: PublicWebsiteArticlesQueryVariables,
) {
  return (
    await request<PublicWebsiteArticlesQuery>(
      PublicWebsiteArticlesDocument,
      variables,
    )
  ).publicWebsiteArticles;
}

export async function getArticle(
  variables: PublicWebsiteArticleQueryVariables,
) {
  return (
    await request<PublicWebsiteArticleQuery>(
      PublicWebsiteArticleDocument,
      variables,
    )
  ).publicWebsiteArticle;
}

export async function getRelatedArticles(
  variables: PublicWebsiteRelatedArticlesQueryVariables,
) {
  return (
    await request<PublicWebsiteRelatedArticlesQuery>(
      PublicWebsiteRelatedArticlesDocument,
      variables,
    )
  ).publicWebsiteRelatedArticles;
}

export async function getPopularArticles(
  variables: PublicWebsitePopularArticlesQueryVariables,
) {
  return (
    await request<PublicWebsitePopularArticlesQuery>(
      PublicWebsitePopularArticlesDocument,
      variables,
    )
  ).publicWebsitePopularArticles;
}

export async function recordArticleView(
  variables: RecordPublicWebsiteArticleViewMutationVariables,
) {
  return (
    await request<RecordPublicWebsiteArticleViewMutation>(
      RecordPublicWebsiteArticleViewDocument,
      variables,
    )
  ).recordPublicWebsiteArticleView;
}

export async function recordArticleShare(
  variables: RecordPublicWebsiteArticleShareMutationVariables,
) {
  return (
    await request<RecordPublicWebsiteArticleShareMutation>(
      RecordPublicWebsiteArticleShareDocument,
      variables,
    )
  ).recordPublicWebsiteArticleShare;
}
