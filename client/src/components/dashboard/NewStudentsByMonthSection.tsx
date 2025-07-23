"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getMonthlyStudentStats } from "@/api/dashboard/dashboard";

export default function NewStudentsByMonthSection() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const fetchAndDraw = async () => {
      try {
        setError(false);
        const response = await getMonthlyStudentStats();
        const data = response.data;

        const xData = data.map((item) => item.month);
        const yData = data.map((item) => item.count);

        chart.setOption({
          tooltip: { trigger: "axis" },
          xAxis: {
            type: "category",
            data: xData,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: yData,
              type: "line",
              smooth: true,
              areaStyle: {},
              lineStyle: {
                color: "#6366F1",
              },
            },
          ],
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("신규 수강생 수 차트 불러오기 실패", error);
        }
        setError(true);
      }
    };

    fetchAndDraw();

    // 차트 리사이즈
    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <section className="bg-white w-full rounded-md p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-2">월별 신규 수강생 현황</h2>
      <p className="text-xs text-gray-400 mb-2">단위: 명</p>
      {error ? (
        <div className="w-full h-[220px] border rounded-sm flex items-center justify-center text-sm text-error">
          데이터를 불러오는 중 오류가 발생했습니다.
        </div>
      ) : (
        <div
          ref={chartRef}
          className="w-full h-[220px] border rounded-sm"
          role="region"
          aria-label="신규 수강생 차트"
        />
      )}
    </section>
  );
}
