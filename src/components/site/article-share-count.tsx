import type { Locale } from "@/lib/public-locale";
import { Share2 } from "lucide-react";

export function ArticleShareCount({
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
  const label =
    locale === "km" ? "ការចែករំលែក" : count === 1 ? "share" : "shares";

  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap"
      aria-label={compact ? `${value} ${label}` : undefined}
    >
      <Share2 className="size-4" aria-hidden="true" />
      {value}
      {compact ? null : ` ${label}`}
    </span>
  );
}
