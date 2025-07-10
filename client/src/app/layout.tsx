import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "./AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalLoading from "@/components/GlobalLoading";

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
        <AuthProvider>
          {children}
          <GlobalLoading />
          <ToastContainer position="bottom-center" autoClose={1500} />
        </AuthProvider>
      </body>
    </html>
  );
}
