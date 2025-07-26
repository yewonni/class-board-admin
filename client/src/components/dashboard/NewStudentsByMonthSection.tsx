"use client";
import React from "react";
import dynamic from "next/dynamic";

const NewStudentsChart = dynamic(() => import("./NewStudentsChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] border rounded-sm flex items-center justify-center text-sm text-gray-500">
      차트 로딩 중...
    </div>
  ),
});

export default function NewStudentsByMonthSection() {
  return (
    <section className="bg-white w-full rounded-md p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-2">월별 신규 수강생 현황</h2>
      <p className="text-xs text-gray-400 mb-2">단위: 명</p>
      <NewStudentsChart />
    </section>
  );
}
