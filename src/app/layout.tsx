import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-VariableFont_opsz,wght.ttf", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/Inter-Italic-VariableFont_opsz,wght.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const khmerDigital = localFont({
  src: [
    { path: "../../public/fonts/KhmerDigital-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/KhmerDigital-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-khmer-digital",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cube Core",
  description: "Cube Core platform",
};

export const instant = false;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = (await cookies()).get("site-locale")?.value === "km" ? "km" : "en";
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${khmerDigital.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
