"use client";

import { useRef, type RefObject } from "react";
import { useSiteSearch } from "@/hooks/use-site-search";
import { Popover } from "radix-ui";
import { Clock, TrendingUp, Search, X } from "lucide-react";
import Link from "next/link";
import { articleHref, articleText, categoryName, subcategoryName, hrefFor, type Locale } from "@/lib/public-locale";
import type { PublicCategory } from "@/types/public-content";

export function SiteSearchDialog({ open, onOpenChange, categories, locale, triggerRef }: {
  triggerRef: RefObject<HTMLButtonElement | null>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: PublicCategory[];
  locale: Locale;
}) {
  const search = useSiteSearch(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const topics = [
    ...categories.flatMap((category) => category.subcategories.map((topic) => ({ label: subcategoryName(topic, locale), href: hrefFor(`/${category.slug}/${topic.slug}`, locale) }))),
    ...categories.map((category) => ({ label: categoryName(category, locale), href: hrefFor(`/${category.slug}`, locale) })),
  ].slice(0, 8);
  const title = locale === "km" ? "ស្វែងរកព័ត៌មាន" : "Search articles";
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Anchor virtualRef={triggerRef} />
      <Popover.Portal>
        <Popover.Content side="bottom" align="end" sideOffset={12} collisionPadding={8}
          aria-label={title} aria-describedby={undefined}
          onOpenAutoFocus={(event) => { event.preventDefault(); inputRef.current?.focus(); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef.current?.focus(); }}
          onInteractOutside={(event) => {
            if (event.target instanceof Node && triggerRef.current?.contains(event.target)) event.preventDefault();
          }}
          className="z-[70] flex max-h-[var(--radix-popover-content-available-height)] w-[calc(100vw-1rem)] max-w-2xl origin-[var(--radix-popover-content-transform-origin)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 dark:border-slate-700 dark:bg-slate-900 sm:w-[42rem]">
          <h2 className="sr-only">{title}</h2>
          <form action={hrefFor("/search", locale)} method="get" onSubmit={search.remember} className="shrink-0 border-b border-slate-200 p-3 dark:border-slate-700 sm:p-6">
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input ref={inputRef} type="text" value={search.query} onChange={(event) => search.setQuery(event.target.value)} name="q" aria-label={title} maxLength={160} placeholder={title}
                className="w-full min-w-0 rounded-lg border border-slate-200 bg-white py-3 pl-11 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:py-4 sm:pl-12 sm:text-lg" />
              <Popover.Close aria-label={locale === "km" ? "បិទ" : "Close search"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:bg-slate-700 dark:hover:text-slate-100">
                <X className="size-5" />
              </Popover.Close>
            </div>
            <button type="submit" className="sr-only">{title}</button>
          </form>
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-h-96">
            {search.query.trim().length > 2 ? <div className="p-4 sm:p-6">
              {search.loading ? <div className="flex items-center justify-center py-8" role="status" aria-label="Searching"><div className="size-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" /></div>
                : search.error ? <p role="alert" className="py-8 text-center text-slate-500">{locale === "km" ? "សូមព្យាយាមម្តងទៀត។" : "Search is unavailable. Please try again."}</p>
                : search.items.length ? <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">{locale === "km" ? "លទ្ធផលស្វែងរក" : "Search Results"}</h3>
                  {search.items.map((article) => <Link key={article.id} href={articleHref(article, locale)} onClick={() => { search.remember(); onOpenChange(false); }} className="block w-full rounded-lg p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-start gap-3"><Search className="mt-1 size-4 shrink-0 text-slate-400" /><div className="min-w-0 flex-1"><p className="break-words font-medium text-slate-900 dark:text-slate-100">{articleText(article, locale).title}</p><p className="break-words text-sm text-slate-500 dark:text-slate-400">{categoryName(article.category, locale)}</p></div></div>
                  </Link>)}
                  <div className="flex flex-wrap gap-2 pt-3">{search.items.slice(0, 5).map((article) => {
                    const title = articleText(article, locale).title;
                    return <button type="button" key={article.id} onClick={() => { search.setQuery(title.slice(0, 160)); inputRef.current?.focus(); }} className="max-w-full break-words rounded-full bg-blue-50 px-3 py-1 text-left text-sm text-blue-700 transition-colors hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700">{title}</button>;
                  })}</div>
                </div> : <p className="break-words py-8 text-center text-slate-500 dark:text-slate-400">{locale === "km" ? `មិនមានលទ្ធផលសម្រាប់ “${search.query}”` : `No results found for “${search.query}”`}</p>}
            </div> : <div className="space-y-6 p-4 sm:p-6">
              {search.recent.length ? <div>
                <div className="mb-3 flex items-center gap-2"><Clock className="size-4 text-slate-400" /><h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">{locale === "km" ? "ការស្វែងរកថ្មីៗ" : "Recent Searches"}</h3></div>
                <div className="flex flex-wrap gap-2">{search.recent.map((query) => <button type="button" key={query} onClick={() => { search.setQuery(query); inputRef.current?.focus(); }} className="max-w-full break-words rounded-full bg-slate-100 px-3 py-1 text-left text-sm text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">{query}</button>)}</div>
              </div> : null}
              {topics.length ? <div>
                <div className="mb-3 flex items-center gap-2"><TrendingUp className="size-4 text-slate-400" /><h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">{locale === "km" ? "ប្រធានបទពេញនិយម" : "Trending Topics"}</h3></div>
                <div className="flex flex-wrap gap-2">{topics.map((topic) => <Link key={topic.href} href={topic.href} onClick={() => onOpenChange(false)} className="max-w-full break-words rounded-full bg-blue-50 px-3 py-1 text-left text-sm text-blue-700 transition-colors hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-300 dark:hover:bg-slate-700">{topic.label}</Link>)}</div>
              </div> : null}
            </div>}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
