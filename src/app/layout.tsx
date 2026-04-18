import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { brand } from "@/config/brand";
import { themeStyleSheet } from "@/config/theme";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: brand.metadata.title.en,
  description: brand.metadata.description.en,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${inter.variable} h-full antialiased`}>
      <head>
        <style
          id="theme-tokens"
          dangerouslySetInnerHTML={{ __html: themeStyleSheet() }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
