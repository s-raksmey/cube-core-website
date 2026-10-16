import type { Metadata } from "next";
import { Suspense } from "react";
import { getArticles, getCategories } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale, publicAssetUrl } from "@/lib/public-site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BreakingStrip } from "@/components/site/breaking-strip";
import { TenantWebsiteUnavailable } from "@/components/tenant-unavailable";
import { MaintenanceRefresh } from "@/components/maintenance-refresh";
import { siteMetadata } from "@/lib/site-metadata";
import { hostnameFromHostHeader } from "@/lib/tenant-resolution";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getPublicTenant();
  const siteName = tenant?.generalSettings?.siteName || tenant?.name;
  const maintenance = tenant?.generalSettings?.website.maintenanceMode;
  const favicon = publicAssetUrl(tenant?.publicWebsiteFaviconUrl);
  const host = (await headers()).get("host");
  const metadataBase = host && hostnameFromHostHeader(host)
    ? new URL(`${host.startsWith("localhost") ? "http" : "https"}://${host}`) : undefined;
  const seo = tenant?.generalSettings?.seo;
  const image = publicAssetUrl(seo?.defaultOgImageUrl) ?? "/news-hero.webp";
  const publicSeo = seo ? { ...seo, defaultOgImageUrl: publicAssetUrl(seo.defaultOgImageUrl) } : seo;
  return {
    ...(tenant ? siteMetadata({ name: siteName!, description: tenant.generalSettings?.siteDescription ?? "", image, seo: publicSeo }, { maintenance })
      : { title: "Website unavailable", description: "Tenant website unavailable", robots: { index: false, follow: false } }),
    metadataBase,
    icons: favicon ? { icon: favicon } : undefined,
  };
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="min-h-svh bg-white dark:bg-slate-950" aria-busy="true" />}>
    <TenantSiteLayout>{children}</TenantSiteLayout>
  </Suspense>;
}

async function TenantSiteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getPublicTenant();
  if (!tenant) return <><TenantWebsiteUnavailable />{children}</>;
  const siteName = tenant.generalSettings?.siteName || tenant.name;
  if (tenant.generalSettings?.website.maintenanceMode) return children;
  const [categories, breaking, locale] = await Promise.all([
    getCategories(tenant.id),
    getArticles({ tenantId: tenant.id, breaking: true, pageSize: 4 }).then((page) => page.items).catch(() => []),
    getSiteLocale(),
  ]);
  return <div lang={locale} className="flex min-h-svh flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <MaintenanceRefresh intervalMs={30_000} />
    <SiteHeader name={siteName} logoUrl={publicAssetUrl(tenant.websiteLogoUrl)} categories={categories} locale={locale} />
    <BreakingStrip articles={breaking} locale={locale} />
    {children}
    <SiteFooter name={siteName} description={tenant.generalSettings?.siteDescription ?? ""}
      contactEmail={tenant.generalSettings?.contactEmail ?? ""} phone={tenant.generalSettings?.phone ?? ""}
      secondaryPhone={tenant.generalSettings?.secondaryPhone ?? null} address={tenant.generalSettings?.address ?? ""}
      categories={categories} socialLinks={tenant.generalSettings?.socialLinks ?? []} locale={locale} />
  </div>;
}
