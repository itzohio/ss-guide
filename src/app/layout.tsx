import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { assetPath } from "@/lib/base-path";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Introduction | SS Guide",
  description:
    "RedLotus SS Guide Remastered — a remastered, in-depth exploration of hack checks and screenshares.",
  icons: {
    icon: assetPath("/sites/redlotusguide/logo.png"),
    apple: assetPath("/sites/redlotusguide/logo.png"),
  },
};

const themeScript = `(function(){try{var m=localStorage.getItem("redlotus-theme")||"light";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
