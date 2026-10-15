"use client";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return <main className="site-shell flex min-h-[55vh] flex-1 flex-col items-center justify-center py-16 text-center">
    <h1 className="text-3xl font-black text-[#101d48] dark:text-white">Stories are temporarily unavailable</h1>
    <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">Please try again shortly.</p>
    <button onClick={reset} className="mt-6 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500">Try again</button>
  </main>;
}
