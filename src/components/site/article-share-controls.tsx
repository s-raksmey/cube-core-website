"use client";

import { recordArticleShareAction } from "@/app/(site)/article-engagement-actions";
import type { ArticleSharePlatform } from "@/lib/apollo/generated/graphql";
import {
  copyArticleLink,
  initiateNativeShare,
  openSocialShare,
  type SocialSharePlatform,
} from "@/lib/article-sharing";
import type { Locale } from "@/lib/public-locale";
import { Check, Copy, Send, Share2 } from "lucide-react";
import { startTransition, useState } from "react";

type Props = {
  articleId: string;
  title: string;
  initialCount: number;
  locale: Locale;
};
export function ArticleShareControls({
  articleId,
  title,
  initialCount,
  locale,
}: Props) {
  const [recordedCount, setRecordedCount] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const count = Math.max(initialCount, recordedCount ?? initialCount);
  const value = new Intl.NumberFormat(
    locale === "km" ? "km-KH" : "en-US",
  ).format(count);
  const label =
    locale === "km" ? "ការចែករំលែក" : count === 1 ? "share" : "shares";
  const buttonClass =
    "grid size-9 shrink-0 place-items-center transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-slate-800";

  function track(platform: ArticleSharePlatform) {
    startTransition(async () => {
      try {
        if (await recordArticleShareAction(articleId, platform)) {
          setRecordedCount(
            (current) => Math.max(current ?? initialCount, initialCount) + 1,
          );
        }
      } catch {
        /* Sharing still succeeds when analytics is unavailable. */
      }
    });
  }

  function openSocial(platform: SocialSharePlatform) {
    openSocialShare(
      platform,
      window.location.href.split("#")[0],
      title,
      (target) => {
        window.open(target, "_blank", "noopener,noreferrer");
      },
      track,
    );
  }

  async function copyLink() {
    try {
      await copyArticleLink(
        window.location.href.split("#")[0],
        (url) => navigator.clipboard.writeText(url),
        () => track("COPY_LINK"),
      );
      setCopyStatus(locale === "km" ? "បានចម្លងតំណ" : "Link copied");
    } catch {
      setCopyStatus(
        locale === "km" ? "មិនអាចចម្លងតំណបាន" : "Could not copy link",
      );
    }
  }

  async function nativeShare() {
    if (typeof navigator.share !== "function") {
      await copyLink();
      return;
    }
    try {
      await initiateNativeShare(
        { title, url: window.location.href.split("#")[0] },
        (data) => navigator.share(data),
        () => track("NATIVE"),
      );
    } catch {
      // A cancelled or failed native share is not counted.
    }
  }

  const shareLabel =
    locale === "km" ? "ចែករំលែកអត្ថបទនេះ" : "Share this article";
  const copied =
    copyStatus === (locale === "km" ? "បានចម្លងតំណ" : "Link copied");

  const copyLabel =
    locale === "km" ? "ចម្លងតំណ" : copied ? "Copied" : "Copy link";
  const facebookLabel =
    locale === "km" ? "ចែករំលែកតាម Facebook" : "Share on Facebook";
  const telegramLabel =
    locale === "km" ? "ចែករំលែកតាម Telegram" : "Share on Telegram";

  return (
    <section className="mt-8" aria-label={shareLabel}>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 border border-border bg-card px-3 py-2 text-card-foreground sm:w-fit sm:justify-start sm:px-4">
        <button
          type="button"
          className={`${buttonClass} text-slate-600 dark:text-slate-300`}
          onClick={() => {
            void nativeShare();
          }}
          title={shareLabel}
          aria-label={shareLabel}
        >
          <Share2 className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`${buttonClass} ${copied ? "text-emerald-600" : "text-slate-600 dark:text-slate-300"}`}
          onClick={() => {
            void copyLink();
          }}
          title={copyLabel}
          aria-label={copyLabel}
        >
          {copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className={`${buttonClass} text-blue-600`}
          onClick={() => openSocial("FACEBOOK")}
          title={facebookLabel}
          aria-label={facebookLabel}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </button>
        <button
          type="button"
          className={`${buttonClass} text-indigo-500`}
          onClick={() => openSocial("TELEGRAM")}
          title={telegramLabel}
          aria-label={telegramLabel}
        >
          <Send className="size-4" aria-hidden="true" />
        </button>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
        <span
          className="whitespace-nowrap pr-1 text-xs text-muted-foreground"
          aria-live="polite"
        >
          {value} {label}
        </span>
      </div>
      {copied ? (
        <p className="sr-only" role="status">
          {copyStatus}
        </p>
      ) : null}
      {copyStatus && !copied ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {copyStatus}
        </p>
      ) : null}
    </section>
  );
}
