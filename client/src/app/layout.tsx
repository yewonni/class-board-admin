import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Your App Title",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans bg-mainBg text-gray-900">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
