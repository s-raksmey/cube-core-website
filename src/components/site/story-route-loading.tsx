import { Loader2 } from "lucide-react";

export function StoryRouteLoading() {
  return (
    <main
      role="status"
      className="site-shell flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center gap-2 py-12 text-sm text-slate-500 dark:text-slate-400"
    >
      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      Loading stories…
    </main>
  );
}
