import { StoryList } from "@/components/site/story-list";
import { hrefFor, type Locale } from "@/lib/public-locale";
import type { PublicArticleSummary } from "@/types/public-content";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export function StoryArchive({
  title,
  articles,
  total,
  page,
  pageSize,
  path,
  locale,
  description,
  parent,
  searchQuery,
  error,
}: {
  title: string;
  articles: PublicArticleSummary[];
  total: number;
  page: number;
  pageSize: number;
  path: string;
  locale: Locale;
  description?: string;
  searchQuery?: string;
  error?: string;
  parent?: { title: string; path: string };
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageHref = (number: number) =>
    hrefFor(`${path}${path.includes("?") ? "&" : "?"}page=${number}`, locale);
  return (
    <main className="site-shell flex-1 py-7 pb-16">
      <nav className="mb-5 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href={hrefFor("/", locale)} className="hover:text-blue-600">
          {locale === "km" ? "ទំព័រដើម" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        {parent ? (
          <>
            <Link
              href={hrefFor(parent.path, locale)}
              className="hover:text-blue-600"
            >
              {parent.title}
            </Link>
            <span className="mx-2">/</span>
          </>
        ) : null}
        <span aria-current="page" className="text-slate-900 dark:text-white">
          {title}
        </span>
      </nav>
      <div className="mb-7 border-b border-slate-200 pb-5 dark:border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#101d48] dark:text-white">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
      {searchQuery !== undefined ? (
        <form key={searchQuery} action={hrefFor("/search", locale)} method="get" className="mb-6">
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input type="search" name="q" aria-label={locale === "km" ? "ស្វែងរកព័ត៌មាន" : "Search articles"} placeholder={locale === "km" ? "ស្វែងរកព័ត៌មាន" : "Search articles…"} defaultValue={searchQuery} maxLength={160}
              className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-24 text-lg text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">{locale === "km" ? "ស្វែងរក" : "Search"}</button>
          </div>
          {searchQuery && !error ? <p className="mt-5 text-sm text-slate-600 dark:text-slate-400" role="status">{locale === "km" ? `លទ្ធផល ${total} សម្រាប់ “${searchQuery}”` : `${total} results for “${searchQuery}”`}</p> : null}
        </form>
      ) : null}
      {error ? <p role="alert" className="mb-6 text-sm text-red-600">{error}</p> : null}
      {!error && articles.length ? (
        <StoryList articles={articles} locale={locale} />
      ) : !error ? (
        <div className="rounded-lg border border-slate-200 p-12 text-center text-slate-500 dark:border-slate-800">
          {searchQuery !== undefined ? <Search aria-hidden="true" className="mx-auto mb-4 size-14 text-slate-400" /> : null}
          <p className="font-semibold text-slate-700 dark:text-slate-200">{searchQuery === "" ? (locale === "km" ? "ស្វែងរកព័ត៌មាន" : "Start your search") : (locale === "km" ? "មិនមានព័ត៌មានទេ" : "No stories found")}</p>
          {searchQuery !== undefined ? <p className="mt-2 text-sm">{locale === "km" ? "បញ្ចូលពាក្យស្វែងរក ដើម្បីស្វែងរកព័ត៌មាន។" : searchQuery ? "Try a different keyword or check your spelling." : "Enter a keyword to find articles."}</p> : null}
        </div>
      ) : null}
      {totalPages > 1 ? (
        <nav
          className="mt-8 flex items-center justify-center gap-4 text-sm"
          aria-label="Pagination"
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 hover:border-blue-500"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Link>
          ) : null}
          <span>
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 hover:border-blue-500"
            >
              Next
              <ChevronRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </main>
  );
}
