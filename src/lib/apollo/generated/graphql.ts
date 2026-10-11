/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type TenantDomainPurpose =
  | 'MANAGEMENT'
  | 'WEBSITE';

export type TenantStatus =
  | 'ACTIVE'
  | 'SUSPENDED';

export type TenantType =
  | 'MAIN'
  | 'SUB';

export type LocalDevelopmentTenantQueryVariables = Exact<{ [key: string]: never; }>;


export type LocalDevelopmentTenantQuery = { localDevelopmentTenant: { id: string, name: string, slug: string } | null };

export type TenantByHostnameQueryVariables = Exact<{
  hostname: string;
  purpose: TenantDomainPurpose;
}>;


export type TenantByHostnameQuery = { tenantByHostname: { id: string, name: string, slug: string, type: TenantType, status: TenantStatus, managementDomain: string | null, websiteDomain: string | null } | null };


export const LocalDevelopmentTenantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LocalDevelopmentTenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"localDevelopmentTenant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<LocalDevelopmentTenantQuery, LocalDevelopmentTenantQueryVariables>;
export const TenantByHostnameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TenantByHostname"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hostname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"purpose"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TenantDomainPurpose"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tenantByHostname"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"hostname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hostname"}}},{"kind":"Argument","name":{"kind":"Name","value":"purpose"},"value":{"kind":"Variable","name":{"kind":"Name","value":"purpose"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"managementDomain"}},{"kind":"Field","name":{"kind":"Name","value":"websiteDomain"}}]}}]}}]} as unknown as DocumentNode<TenantByHostnameQuery, TenantByHostnameQueryVariables>;