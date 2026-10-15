import { Loader2 } from "lucide-react";

export default function SiteLoading() {
  return <main role="status" className="flex min-h-64 flex-1 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="size-5 animate-spin" aria-hidden="true" />Loading stories…</main>;
}
