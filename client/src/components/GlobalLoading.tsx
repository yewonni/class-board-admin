"use client";

import { useLoadingStore } from "@/store/useLoadingStore";
import Loader from "./Loader";

export default function GlobalLoading() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black bg-opacity-30 flex items-center justify-center">
      <Loader />
    </div>
  );
}
