"use client";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
export default function SettingsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return null;
  }
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Header>{SIDEBAR_LABELS.SETTINGS}</Header>
        <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6 text-gray-600">
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-800 mb-2">
              설정 기능 준비 중입니다
            </h2>
            <p className="text-sm">
              사용자 경험을 향상시키기 위한 간단한 설정들을 차근차근 준비하고
              있습니다.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg text-gray-800 mb-1">예정된 기능</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>관리자 비밀번호 변경 기능 추가</li>
              <li> 웹소켓 기반 실시간 알림 시스템 확장</li>
              <li>기타 사용자 편의 기능 순차적 추가</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
