"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/api/axiosInstance";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const refresh = async () => {
      if (pathname === "/login" || pathname === "/") {
        setIsReady(true);
        return;
      }

      try {
        const res = await axiosInstance.post("/auth/refresh");
        setAccessToken(res.data.accessToken);
      } catch (error) {
        console.error("토큰 갱신 실패", error);
        router.replace("/login");
      } finally {
        setIsReady(true);
      }
    };

    refresh();
  }, [pathname, router, setAccessToken]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
