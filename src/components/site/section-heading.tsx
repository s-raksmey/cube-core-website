import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ title, href, actionLabel = "View all" }: { title: string; href?: string; actionLabel?: string }) {
  return <div className="mb-3 flex min-h-10 items-center justify-between gap-4">
    <h2 className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-[#101d48] dark:text-white sm:text-2xl"><span className="h-7 w-1.5 bg-blue-600" />{title}</h2>
    {href ? <Link href={href} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-300">{actionLabel}<ArrowRight className="size-4" /></Link> : null}
  </div>;
}
