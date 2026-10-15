import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-VariableFont_opsz,wght.ttf", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/Inter-Italic-VariableFont_opsz,wght.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKhmer = localFont({
  src: "../../public/fonts/NotoSansKhmer-VariableFont_wdth,wght.ttf",
  variable: "--font-noto-sans-khmer",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cube Core",
  description: "Cube Core platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="km"
      suppressHydrationWarning
      className={`${inter.variable} ${notoSansKhmer.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try {
          const dark = localStorage.getItem("cube-site-theme") === "dark";
          document.documentElement.classList.toggle("dark", dark);
          document.documentElement.style.colorScheme = dark ? "dark" : "light";
          document.documentElement.lang = location.pathname === "/en" || location.pathname.startsWith("/en/") ? "en" : "km";
        } catch {}` }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
