"use client";
import React from "react";
import dynamic from "next/dynamic";

const ProgressionRateChart = dynamic(() => import("./ProgressionRateChart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[220px] border rounded-sm flex items-center justify-center text-sm text-gray-500">
      차트 로딩 중...
    </div>
  ),
});

export default function ProgressionRateByCourseSection() {
  return (
    <section className="bg-white w-full rounded-md p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-2">강의별 수강생 평균 진도율</h2>
      <p className="text-xs text-gray-400 mb-2">단위: %</p>
      <ProgressionRateChart />
    </section>
  );
}
