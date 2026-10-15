import type { Metadata } from "next";
import { getArticles, getCategories } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale, publicAssetUrl } from "@/lib/public-site";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { BreakingStrip } from "@/components/site/breaking-strip";
import { TenantWebsiteUnavailable } from "@/components/tenant-unavailable";

// Tenant selection depends on the request hostname, so the site renders per request.
export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getPublicTenant();
  const favicon = publicAssetUrl(tenant?.publicWebsiteFaviconUrl);
  const image = publicAssetUrl(tenant?.openGraphImageUrl);
  return {
    title: tenant?.name ?? "Website unavailable",
    description: tenant ? `Latest stories from ${tenant.name}` : "Tenant website unavailable",
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const tenant = await getPublicTenant();
  if (!tenant) return <TenantWebsiteUnavailable />;
  const [categories, breaking, locale] = await Promise.all([
    getCategories(tenant.id),
    getArticles({ tenantId: tenant.id, breaking: true, pageSize: 4 }).then((page) => page.items).catch(() => []),
    getSiteLocale(),
  ]);
  return <div className="flex min-h-svh flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <SiteHeader name={tenant.name} logoUrl={publicAssetUrl(tenant.websiteLogoUrl)} categories={categories} locale={locale} />
    <BreakingStrip articles={breaking} locale={locale} />
    {children}
    <SiteFooter name={tenant.name} categories={categories} locale={locale} />
  </div>;
}
