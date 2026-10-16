/** Identity and settings come from sibling GraphQL fields; reject a mismatch. */
export function combineResolvedTenant<Identity extends { id: string }, Settings extends { tenantId: string }>(
  identity: Identity | null,
  settings: Settings | null,
) {
  return identity && settings?.tenantId === identity.id
    ? { ...identity, generalSettings: settings } : null;
}
