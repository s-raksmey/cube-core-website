"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Rechecks uncached public config in an open tab after a maintenance toggle. */
export function MaintenanceRefresh({ intervalMs = 15_000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === "visible") router.refresh(); };
    const interval = window.setInterval(refresh, intervalMs);
    const onVisible = () => refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router, intervalMs]);
  return null;
}
