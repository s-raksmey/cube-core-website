import "server-only";

import { print } from "graphql";
import {
  TenantByHostnameDocument,
  LocalDevelopmentTenantDocument,
  type LocalDevelopmentTenantQuery,
  type TenantByHostnameQuery,
} from "@/lib/apollo/generated/graphql";

export type PublicTenant = NonNullable<
  TenantByHostnameQuery["tenantByHostname"]
>;
export type PublicTenantIdentity = NonNullable<
  LocalDevelopmentTenantQuery["localDevelopmentTenant"]
>;

export function hostnameFromHostHeader(hostHeader: string | null) {
  if (!hostHeader || /[\/@?#\s]/.test(hostHeader)) return null;
  try {
    return new URL(`http://${hostHeader}`).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export async function resolvePublicTenant(hostname: string): Promise<PublicTenant | null> {
  const serverUrl =
    process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql";
  const response = await fetch(serverUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: print(TenantByHostnameDocument),
      variables: { hostname, purpose: "WEBSITE" },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Tenant service is unavailable");

  const payload = (await response.json()) as {
    data?: TenantByHostnameQuery;
    errors?: { message: string }[];
  };
  if (payload.errors?.length || !payload.data) {
    throw new Error("Tenant service could not resolve this website");
  }
  return payload.data.tenantByHostname;
}

export async function resolveLocalDevelopmentTenant(
): Promise<PublicTenantIdentity | null> {
  const serverUrl =
    process.env.GRAPHQL_SERVER_URL ?? "http://localhost:4000/graphql";
  const response = await fetch(serverUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: print(LocalDevelopmentTenantDocument),
      variables: {},
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error("Tenant service is unavailable");

  const payload = (await response.json()) as {
    data?: LocalDevelopmentTenantQuery;
    errors?: { message: string }[];
  };
  if (payload.errors?.length || !payload.data) {
    throw new Error("Tenant service could not resolve this website");
  }
  return payload.data.localDevelopmentTenant;
}
