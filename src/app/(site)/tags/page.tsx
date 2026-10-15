import Link from "next/link";
import { getTags } from "@/lib/public-content";
import { getPublicTenant, getSiteLocale } from "@/lib/public-site";
import { hrefFor } from "@/lib/public-locale";

export default async function TagsPage() {
  const tenant = await getPublicTenant();
  if (!tenant) return null;
  const [tags, locale] = await Promise.all([getTags(tenant.id), getSiteLocale()]);
  return <main className="site-shell flex-1 py-7 pb-16">
    <nav className="mb-5 text-sm text-slate-500" aria-label="Breadcrumb"><Link href={hrefFor("/", locale)} className="hover:text-blue-600">{locale === "km" ? "ទំព័រដើម" : "Home"}</Link><span className="mx-2">/</span><span className="text-slate-900 dark:text-white">{locale === "km" ? "ស្លាក" : "Tags"}</span></nav>
    <h1 className="mb-7 border-b border-slate-200 pb-5 text-3xl font-extrabold tracking-tight text-[#101d48] dark:border-slate-800 dark:text-white">{locale === "km" ? "ស្លាក" : "Tags"}</h1>
    {tags.length ? <div className="flex flex-wrap gap-3">{tags.map((tag) => <Link key={tag.slug} href={hrefFor(`/tags/${tag.slug}`, locale)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:text-slate-200">#{locale === "km" ? tag.translations.find((item) => item.locale === "km")?.name ?? tag.name : tag.name}</Link>)}</div> : <p className="rounded-lg border border-slate-200 p-12 text-center text-slate-500 dark:border-slate-800">{locale === "km" ? "មិនមានស្លាកទេ" : "No tags yet"}</p>}
  </main>;
}
