import { categoryName, hrefFor, type Locale } from "@/lib/public-locale";
import type { PublicCategory } from "@/types/public-content";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { SocialPlatform } from "@/lib/apollo/generated/graphql";

const socialNames: Record<SocialPlatform, string> = {
  FACEBOOK: "Facebook", TELEGRAM: "Telegram", YOUTUBE: "YouTube", TIKTOK: "TikTok",
  INSTAGRAM: "Instagram", X: "X", LINKEDIN: "LinkedIn",
};

export function SiteFooter({
  name,
  description,
  contactEmail,
  phone,
  secondaryPhone,
  address,
  categories,
  socialLinks,
  locale,
}: {
  name: string;
  description: string;
  contactEmail: string;
  phone: string;
  secondaryPhone: string | null;
  address: string;
  categories: PublicCategory[];
  socialLinks: { platform: SocialPlatform; url: string }[];
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
            {description || (locale === "km"
              ? "ព័ត៌មានថ្មីៗពីសហគមន៍របស់អ្នក។"
              : "Latest stories and reporting from your community.")}
          </p>
          {contactEmail || phone || secondaryPhone || address ? <address className="mt-4 grid gap-1 text-sm not-italic text-slate-400">
            {contactEmail ? <a href={`mailto:${contactEmail}`} className="w-fit hover:text-white">{contactEmail}</a> : null}
            {phone ? <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="w-fit hover:text-white">{phone}</a> : null}
            {secondaryPhone ? <a href={`tel:${secondaryPhone.replace(/[^+\d]/g, "")}`} className="w-fit hover:text-white">{secondaryPhone}</a> : null}
            {address ? <span>{address}</span> : null}
          </address> : null}
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
          {socialLinks.length ? <div className="mt-7">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">{locale === "km" ? "បណ្ដាញសង្គម" : "Follow us"}</h2>
            <nav aria-label={locale === "km" ? "បណ្ដាញសង្គម" : "Social links"} className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {socialLinks.map((link) => <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">
                {socialNames[link.platform]}<ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>)}
            </nav>
          </div> : null}
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {name}
      </div>
    </footer>
  );
}
