import type { Locale } from "@/lib/public-locale";
import { Eye } from "lucide-react";

export function ArticleViewCount({
  count,
  locale,
  compact = false,
}: {
  count: number;
  locale: Locale;
  compact?: boolean;
}) {
  const value = new Intl.NumberFormat(
    locale === "km" ? "km-KH" : "en-US",
  ).format(count);
  const label = locale === "km" ? "ការមើល" : count === 1 ? "view" : "views";
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap"
      aria-label={compact ? `${value} ${label}` : undefined}
    >
      <Eye className="size-4" aria-hidden="true" />
      {value}
      {compact ? null : ` ${label}`}
    </span>
  );
}
