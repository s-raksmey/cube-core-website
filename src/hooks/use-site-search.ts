"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { searchArticlePreview } from "@/app/(site)/search/actions";
import type { PublicArticleSummary } from "@/types/public-content";

const historyKey = "cube-public-recent-searches";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}
function snapshot() {
  try { return localStorage.getItem(historyKey) ?? "[]"; } catch { return "[]"; }
}

export function useSiteSearch(open: boolean) {
  const [query, setQuery] = useState("");
  const stored = useSyncExternalStore(subscribe, snapshot, () => "[]");
  let recent: string[] = [];
  try {
    const values: unknown = JSON.parse(stored);
    if (Array.isArray(values)) recent = values.filter((value): value is string => typeof value === "string" && value.length <= 160).slice(0, 4);
  } catch { /* Ignore invalid browser history. */ }
  const search = query.trim();
  const [response, setResponse] = useState<{ query: string; items: PublicArticleSummary[]; error: boolean } | null>(null);
  useEffect(() => {
    if (!open || search.length < 3) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const items = await searchArticlePreview(search);
        if (!cancelled) setResponse({ query: search, items, error: false });
      } catch {
        if (!cancelled) setResponse({ query: search, items: [], error: true });
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [open, search]);
  function remember() {
    if (!search) return;
    try {
      localStorage.setItem(historyKey, JSON.stringify([search, ...recent.filter((item) => item !== search)].slice(0, 4)));
      window.dispatchEvent(new Event("storage"));
    } catch { /* Search still works when storage is disabled. */ }
  }
  return {
    query, setQuery, recent, remember,
    loading: search.length > 2 && response?.query !== search,
    items: response?.query === search ? response.items : [],
    error: response?.query === search && response.error,
  };
}
