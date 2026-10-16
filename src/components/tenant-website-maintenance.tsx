import type { Locale } from "@/lib/public-locale";
import { MaintenanceRefresh } from "@/components/maintenance-refresh";

type Props = { siteName: string; message: string | null; locale: Locale };

/** Public-only view; tenant management and authentication routes live in separate apps. */
export function TenantWebsiteMaintenance({ siteName, message, locale }: Props) {
  const title = locale === "km" ? "គេហទំព័រកំពុងថែទាំ" : "Website under maintenance";
  const fallback = locale === "km"
    ? "យើងកំពុងកែលម្អគេហទំព័រ។ សូមត្រឡប់មកវិញក្នុងពេលឆាប់ៗ។"
    : "We’re making improvements. Please check back soon.";
  return <main className="flex min-h-svh items-center justify-center bg-background px-5 py-16 text-foreground">
    <MaintenanceRefresh />
    <div className="w-full max-w-xl border-t-4 border-primary pt-8 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">{siteName}</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-5 whitespace-pre-wrap text-base leading-7 text-muted-foreground">{message?.trim() || fallback}</p>
    </div>
  </main>;
}
