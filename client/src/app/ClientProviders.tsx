"use client";

import dynamic from "next/dynamic";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

const AuthProvider = dynamic(() => import("./AuthProvider"), { ssr: false });
const GlobalLoading = dynamic(() => import("@/components/GlobalLoading"), {
  ssr: false,
});
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
      <GlobalLoading />
      <ToastContainer position="bottom-center" autoClose={1500} />
    </AuthProvider>
  );
}
