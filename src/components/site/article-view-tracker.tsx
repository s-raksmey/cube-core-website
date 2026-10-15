"use client";

import { recordArticleVisit } from "@/app/(site)/article-engagement-actions";
import { ArticleViewCount } from "@/components/site/article-view-count";
import type { Locale } from "@/lib/public-locale";
import { startTransition, useEffect, useRef, useState } from "react";

export function ArticleViewTracker({
  articleId,
  initialCount,
  locale,
}: {
  articleId: string;
  initialCount: number;
  locale: Locale;
}) {
  const started = useRef(false);
  const [recordedCount, setRecordedCount] = useState<number | null>(null);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startTransition(async () => {
      if (await recordArticleVisit(articleId))
        setRecordedCount(initialCount + 1);
    });
  }, [articleId, initialCount]);
  return (
    <ArticleViewCount
      count={Math.max(initialCount, recordedCount ?? initialCount)}
      locale={locale}
    />
  );
}
