import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { TenantWebsiteUnavailable } from "@/components/tenant-unavailable";
import {
  hostnameFromHostHeader,
  resolvePublicTenant,
  resolveLocalDevelopmentTenant,
} from "@/lib/tenant-resolution";

function isLocalHost(hostHeader: string | null) {
  return hostnameFromHostHeader(hostHeader) === "localhost";
}

async function PublicTenantSite() {
  const tenant = await tenantForRequest();
  if (!tenant) return <TenantWebsiteUnavailable />;
  return <TenantLanding tenant={tenant} />;
}

async function tenantForRequest(
) {
  const hostHeader = (await headers()).get("host");
  const hostname = hostnameFromHostHeader(hostHeader);
  if (process.env.NODE_ENV !== "production" && isLocalHost(hostHeader)) {
    try {
      return await resolveLocalDevelopmentTenant();
    } catch {
      // A local routing lookup is only a display/routing hint. Do not turn a
      // unavailable GraphQL service or unapplied local migration into a 500.
      return null;
    }
  }
  if (!hostname) return null;

  const tenant = await resolvePublicTenant(hostname);
  // Unknown, inactive, deleted, and suspended host mappings all use the
  // same not-found response to avoid exposing tenant lifecycle state.
  return tenant?.status === "ACTIVE" ? tenant : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await tenantForRequest();
  const assetUrl = tenant?.publicWebsiteFaviconUrl
    ? publicAssetUrl(tenant.publicWebsiteFaviconUrl)
    : undefined;
  return {
    title: tenant?.name ?? "Website unavailable",
    description: tenant ? `Official website of ${tenant.name}` : "Tenant website unavailable",
    icons: assetUrl ? { icon: assetUrl } : undefined,
    openGraph: tenant?.openGraphImageUrl ? { images: [publicAssetUrl(tenant.openGraphImageUrl)] } : undefined,
  };
}

function publicAssetUrl(path: string) {
  const base = (process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql").replace(/\/graphql$/, "");
  return `${base}${path}`;
}

function TenantLanding({ tenant }: { tenant: NonNullable<Awaited<ReturnType<typeof tenantForRequest>>> }) {
  const name = tenant.name;
  return (
    <main className="min-h-svh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight" aria-label={`${name} home`}>
            {tenant.websiteLogoUrl ? <Image src={publicAssetUrl(tenant.websiteLogoUrl)} alt={`${name} logo`} width={160} height={40} unoptimized className="h-10 w-auto object-contain" /> : name}
          </Link>
        </div>
      </header>
      <section className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-6 py-16 text-center">
        <div className="w-full max-w-3xl space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{name}</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Public website content has not been published yet.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
          Loading website…
        </main>
      }
    >
      <PublicTenantSite />
    </Suspense>
  );
}
