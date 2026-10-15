import type { Locale } from "@/lib/public-locale";

type Props = {
  locale: Locale;
  onSelect: (locale: Locale) => void;
};

export function SiteLanguageToggle({ locale, onSelect }: Props) {
  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center rounded-md border border-slate-200 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-800"
    >
      {(["en", "km"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          aria-pressed={locale === option}
          className={`rounded px-2 py-1 ${locale === option ? "bg-[#385CF5] text-white" : "text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300"}`}
        >
          {option === "en" ? "EN" : "KH"}
        </button>
      ))}
    </div>
  );
}
