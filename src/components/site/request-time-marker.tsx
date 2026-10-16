import { Suspense } from "react";
import { connection } from "next/server";

async function RequestConnection() {
  await connection();
  return null;
}

/** Tenant metadata depends on the request hostname and fresh public settings. */
export function RequestTimeMarker() {
  return <Suspense fallback={null}><RequestConnection /></Suspense>;
}
