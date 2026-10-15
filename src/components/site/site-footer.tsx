import { categoryName, hrefFor, type Locale } from "@/lib/public-locale";
import type { PublicCategory } from "@/types/public-content";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SiteFooter({
  name,
  categories,
  locale,
}: {
  name: string;
  categories: PublicCategory[];
  locale: Locale;
}) {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-[1720px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <Link
            href={hrefFor("/", locale)}
            className="text-xl font-black uppercase tracking-tight text-white"
          >
            {name}
          </Link>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
            {locale === "km"
              ? "ព័ត៌មានថ្មីៗពីសហគមន៍របស់អ្នក។"
              : "Latest stories and reporting from your community."}
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            {locale === "km" ? "ផ្នែកព័ត៌មាន" : "Sections"}
          </h2>
          <nav className="grid gap-2 text-sm">
            <Link href={hrefFor("/", locale)} className="hover:text-white">
              {locale === "km" ? "ទំព័រដើម" : "Home"}
            </Link>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={hrefFor(`/${category.slug}`, locale)}
                className="hover:text-white"
              >
                {categoryName(category, locale)}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            {locale === "km" ? "ស្វែងរក" : "Explore"}
          </h2>
          <nav className="grid gap-2 text-sm">
            <Link
              href={hrefFor("/search", locale)}
              className="inline-flex items-center gap-1 hover:text-white"
            >
              {locale === "km" ? "ស្វែងរកព័ត៌មាន" : "Search articles"}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link href={hrefFor("/tags", locale)} className="hover:text-white">
              {locale === "km" ? "ស្លាក" : "Tags"}
            </Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {name}
      </div>
    </footer>
  );
}
