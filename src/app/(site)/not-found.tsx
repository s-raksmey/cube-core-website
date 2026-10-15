import Link from "next/link";

export default function SiteNotFound() {
  return <main className="site-shell flex min-h-[55vh] flex-1 flex-col items-center justify-center py-16 text-center">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">404</p>
    <h1 className="mt-3 text-3xl font-black text-[#101d48] dark:text-white">Story not found</h1>
    <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">This story may have moved or is no longer published.</p>
    <Link href="/" className="mt-6 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500">Back to home</Link>
  </main>;
}
