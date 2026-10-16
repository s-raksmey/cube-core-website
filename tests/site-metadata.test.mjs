import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleMetadata, siteMetadata } from "../src/lib/site-metadata.ts";

const site = {
  name: "Cambo Site",
  description: "Site description",
  image: "/site-image.png",
  seo: {
    allowIndexing: true,
    metaTitle: "Tenant meta title",
    metaDescription: "Tenant meta description",
    ogTitle: "Tenant OG title",
    ogDescription: "Tenant OG description",
    defaultOgImageUrl: "/tenant-image.png",
  },
};

describe("public SEO metadata", () => {
  it("uses article-specific metadata before the article, tenant, and site defaults", () => {
    const result = articleMetadata(site, {
      title: "Article title", summary: "Article summary", featuredImageUrl: "/featured.png",
      seo: {
        metaTitle: "Article meta title", metaDescription: "Article meta description",
        ogTitle: "Article OG title", ogDescription: "Article OG description", ogImageUrl: "/article-og.png",
      },
    });
    assert.equal(result.title, "Article meta title");
    assert.equal(result.description, "Article meta description");
    assert.equal(result.openGraph.title, "Article OG title");
    assert.equal(result.openGraph.description, "Article OG description");
    assert.deepEqual(result.openGraph.images, ["/article-og.png"]);
  });

  it("uses article content and featured image when article SEO is absent", () => {
    const result = articleMetadata(site, { title: "Article title", summary: "Article summary", featuredImageUrl: "/featured.png" });
    assert.equal(result.title, "Article title");
    assert.equal(result.description, "Article summary");
    assert.equal(result.openGraph.title, "Article title");
    assert.equal(result.openGraph.description, "Article summary");
    assert.deepEqual(result.openGraph.images, ["/featured.png"]);
  });

  it("uses tenant SEO defaults and falls back from blank OG values to meta values", () => {
    const result = siteMetadata({ ...site, seo: { ...site.seo, ogTitle: "", ogDescription: "" } });
    assert.equal(result.title, "Tenant meta title");
    assert.equal(result.openGraph.title, "Tenant meta title");
    assert.equal(result.openGraph.description, "Tenant meta description");
    assert.deepEqual(result.openGraph.images, ["/tenant-image.png"]);
  });

  it("uses general site defaults for an existing tenant without SEO settings", () => {
    const result = siteMetadata({ ...site, seo: null });
    assert.equal(result.title, "Cambo Site");
    assert.equal(result.description, "Site description");
    assert.equal(result.openGraph.title, "Cambo Site");
    assert.deepEqual(result.openGraph.images, ["/site-image.png"]);
  });

  it("makes disabled indexing, maintenance, and private article content non-indexable", () => {
    const noIndex = { index: false, follow: false };
    assert.deepEqual(siteMetadata({ ...site, seo: { ...site.seo, allowIndexing: false } }).robots, noIndex);
    assert.deepEqual(siteMetadata(site, { maintenance: true }).robots, noIndex);
    assert.deepEqual(articleMetadata(site, { title: "Draft" }, { publiclyVisible: false }).robots, noIndex);
    assert.deepEqual(articleMetadata({ ...site, seo: { ...site.seo, allowIndexing: false } }, { title: "Published" }).robots, noIndex);
  });
});
