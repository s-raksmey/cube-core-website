import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { combineResolvedTenant } from "../src/lib/resolved-tenant.ts";

const alpha = { id: "tenant-a", name: "Alpha News" };
const beta = { id: "tenant-b", name: "Beta News" };
const alphaSettings = {
  tenantId: "tenant-a", siteName: "Alpha News", siteDescription: "Alpha reporting",
  contactEmail: "alpha@example.test", phone: "+10000000001", secondaryPhone: null,
  address: "Alpha Street", website: { maintenanceMode: true, maintenanceMessage: "Alpha maintenance" },
  socialLinks: [{ platform: "FACEBOOK", url: "https://facebook.com/alpha" }],
  seo: { allowIndexing: false, metaTitle: "Alpha SEO" },
};
const betaSettings = {
  tenantId: "tenant-b", siteName: "Beta News", siteDescription: "Beta reporting",
  contactEmail: "beta@example.test", phone: "+10000000002", secondaryPhone: "+10000000003",
  address: "Beta Street", website: { maintenanceMode: false, maintenanceMessage: null },
  socialLinks: [{ platform: "TELEGRAM", url: "https://t.me/beta" }],
  seo: { allowIndexing: true, metaTitle: "Beta SEO" },
};

describe("hostname-resolved public tenant configuration", () => {
  it("keeps two tenants' names, contacts, maintenance, social links, and SEO separate", () => {
    const a = combineResolvedTenant(alpha, alphaSettings);
    const b = combineResolvedTenant(beta, betaSettings);
    assert.equal(a?.generalSettings.siteName, "Alpha News");
    assert.equal(a?.generalSettings.contactEmail, "alpha@example.test");
    assert.equal(a?.generalSettings.website.maintenanceMode, true);
    assert.deepEqual(a?.generalSettings.socialLinks, alphaSettings.socialLinks);
    assert.equal(a?.generalSettings.seo.metaTitle, "Alpha SEO");
    assert.equal(b?.generalSettings.siteName, "Beta News");
    assert.equal(b?.generalSettings.secondaryPhone, "+10000000003");
    assert.equal(b?.generalSettings.website.maintenanceMode, false);
    assert.deepEqual(b?.generalSettings.socialLinks, betaSettings.socialLinks);
    assert.equal(b?.generalSettings.seo.metaTitle, "Beta SEO");
  });

  it("rejects a mismatched or missing configuration during a hostname reassignment", () => {
    assert.equal(combineResolvedTenant(alpha, betaSettings), null);
    assert.equal(combineResolvedTenant(beta, alphaSettings), null);
    assert.equal(combineResolvedTenant(alpha, null), null);
    assert.equal(combineResolvedTenant(null, alphaSettings), null);
  });
});
