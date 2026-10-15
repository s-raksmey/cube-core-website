"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, Moon, Search, X } from "lucide-react";
import { categoryName, hrefFor, subcategoryName, type Locale } from "@/lib/public-locale";
import type { PublicCategory } from "@/types/public-content";

type Props = { name: string; logoUrl: string | null; categories: PublicCategory[]; locale: Locale };

export function SiteHeader({ name, logoUrl, categories, locale }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCategory = categories.find((item) => item.slug === activeSlug);

  useEffect(() => {
    if (localStorage.getItem("cube-site-theme") === "dark") document.documentElement.classList.add("dark");
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  function openCategory(slug: string | null) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveSlug(slug);
  }
  function closeCategorySoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveSlug(null), 150);
  }
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("cube-site-theme", dark ? "dark" : "light");
  }
  function toggleLocale() {
    document.cookie = `site-locale=${locale === "en" ? "km" : "en"}; Path=/; SameSite=Lax; Max-Age=31536000`;
    const url = new URL(window.location.href);
    if (locale === "en") url.searchParams.set("lang", "km");
    else url.searchParams.delete("lang");
    window.location.assign(url.pathname + url.search + url.hash);
  }

  return <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" onMouseLeave={closeCategorySoon}>
      <div className="mx-auto flex h-14 max-w-[1720px] items-center gap-2 px-3 sm:px-6 lg:h-16 lg:gap-4 lg:px-8 xl:px-10">
        <Link href={hrefFor("/", locale)} onMouseEnter={() => openCategory(null)} className="flex min-w-0 flex-1 items-center gap-2.5 lg:flex-none" aria-label={`${name} home`}>
          {logoUrl ? <Image src={logoUrl} alt="" width={40} height={40} unoptimized className="size-8 shrink-0 object-contain lg:size-10" /> : <span className="grid size-9 shrink-0 place-items-center rounded bg-blue-600 text-lg font-black text-white">{name[0]}</span>}
          <span className="max-w-[44vw] truncate text-lg font-black uppercase leading-none tracking-tight text-[#0f172a] dark:text-white sm:max-w-none lg:text-2xl">{name}</span>
        </Link>
        <nav className={`hidden min-w-0 flex-1 items-center justify-center text-slate-800 dark:text-slate-100 lg:flex ${locale === "km" ? "gap-1 text-[13px] font-semibold xl:gap-2 xl:text-sm 2xl:gap-4" : "gap-2 text-sm font-medium xl:gap-4 2xl:gap-6"}`} aria-label="Categories">
          <Link href={hrefFor("/", locale)} onMouseEnter={() => openCategory(null)} className="site-nav-link">{locale === "km" ? "ទំព័រដើម" : "Home"}</Link>
          {categories.slice(0, 8).map((category) => <Link key={category.id} href={hrefFor(`/${category.slug}`, locale)} onMouseEnter={() => openCategory(category.slug)} onFocus={() => openCategory(category.slug)} aria-expanded={activeSlug === category.slug} className="site-nav-link inline-flex items-center gap-1">
            <span className="max-w-[135px] truncate xl:max-w-[170px] 2xl:max-w-[210px]">{categoryName(category, locale)}</span><ChevronDown className={`size-3.5 shrink-0 transition-transform ${activeSlug === category.slug ? "rotate-180" : ""}`} aria-hidden="true" />
          </Link>)}
        </nav>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:gap-3">
          <button type="button" className="site-icon-button" onClick={() => { setSearchOpen((value) => !value); openCategory(null); }} aria-label="Search"><Search className="size-4" /></button>
          <button type="button" className="site-icon-button" onClick={toggleTheme} aria-label="Toggle dark mode"><Moon className="size-4" /></button>
          <button type="button" className="rounded px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 dark:text-slate-200" onClick={toggleLocale} aria-label="Change language">{locale === "en" ? "ខ្មែរ" : "EN"}</button>
          <button type="button" className="site-icon-button lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        </div>
      </div>
      {activeCategory ? <div className="absolute inset-x-0 top-full border-t border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900" onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }} onMouseLeave={closeCategorySoon}>
        <div className="mx-auto max-w-7xl px-6 py-8">
          {activeCategory.subcategories.length ? <div className="flex flex-col gap-6 md:flex-row md:gap-12 lg:gap-16">
            {[activeCategory.subcategories.slice(0, 6), activeCategory.subcategories.slice(6, 12)].filter((items) => items.length).map((items, group) => <div key={group} className="min-w-0 md:w-64 lg:w-72">
              <p className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{group ? (locale === "km" ? "ប្រធានបទផ្សេងទៀត" : "More Topics") : `${categoryName(activeCategory, locale)} ${locale === "km" ? "ប្រធានបទ" : "Topics"}`}</p>
              <ul className="space-y-3">{items.map((topic) => <li key={topic.slug}><Link href={hrefFor(`/${activeCategory.slug}/${topic.slug}`, locale)} onClick={() => setActiveSlug(null)} className="text-lg font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-300">{subcategoryName(topic, locale)}</Link></li>)}</ul>
            </div>)}
            {activeCategory.subcategories.length > 12 ? <Link href={hrefFor(`/${activeCategory.slug}`, locale)} onClick={() => setActiveSlug(null)} className="self-end text-sm font-semibold text-blue-600 hover:text-blue-700">{locale === "km" ? "មើលទាំងអស់" : `View all ${activeCategory.subcategories.length} topics`} →</Link> : null}
          </div> : <div className="py-8 text-center"><p className="text-lg text-slate-600 dark:text-slate-200">{locale === "km" ? "មិនទាន់មានប្រធានបទទេ" : `No topics available yet for ${categoryName(activeCategory, locale)}`}</p><p className="mt-3 text-sm text-slate-500">{locale === "km" ? "ប្រធានបទនឹងបង្ហាញនៅទីនេះនៅពេលមាន។" : "Topics will appear here as they are created by the editorial team."}</p><Link href={hrefFor(`/${activeCategory.slug}`, locale)} onClick={() => setActiveSlug(null)} className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700">{locale === "km" ? "មើលព័ត៌មាន" : `Browse ${categoryName(activeCategory, locale)} Articles`} →</Link></div>}
        </div>
      </div> : null}
      {searchOpen ? <form action="/search" className="mx-auto flex max-w-[1720px] gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:px-6 lg:px-8">
        <input autoFocus name="q" required maxLength={160} placeholder={locale === "km" ? "ស្វែងរកព័ត៌មាន" : "Search articles"} className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
        {locale === "km" ? <input type="hidden" name="lang" value="km" /> : null}<button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Search</button>
      </form> : null}
      {menuOpen ? <nav className="max-h-[70vh] overflow-y-auto border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 lg:hidden" aria-label="Mobile categories">
        <Link href={hrefFor("/", locale)} onClick={() => setMenuOpen(false)} className="site-mobile-link">{locale === "km" ? "ទំព័រដើម" : "Home"}</Link>
        {categories.map((category) => <div key={category.id}><Link href={hrefFor(`/${category.slug}`, locale)} onClick={() => setMenuOpen(false)} className="site-mobile-link">{categoryName(category, locale)}</Link>{category.subcategories.map((topic) => <Link key={topic.slug} href={hrefFor(`/${category.slug}/${topic.slug}`, locale)} onClick={() => setMenuOpen(false)} className="block px-5 py-2 text-xs text-slate-500 hover:text-blue-600 dark:text-slate-300">{subcategoryName(topic, locale)}</Link>)}</div>)}
      </nav> : null}
    </header>
    <div className="h-14 lg:h-16" aria-hidden="true" />
  </>;
}
