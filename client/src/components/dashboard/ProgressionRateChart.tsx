"use client";
import React, { useEffect, useRef, useState } from "react";

import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { getCourseAverageProgress } from "@/api/dashboard/dashboard";

echarts.use([
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  CanvasRenderer,
]);

export default function ProgressionRateChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const fetchAndDraw = async () => {
      try {
        setError(false);
        const response = await getCourseAverageProgress();
        const data = response.data;

        const xData = data.map((item) => item.lectureTitle);
        const yData = data.map((item) => item.avgProgress);

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
              type: "bar",
              itemStyle: {
                color: "#7C3AED",
              },
            },
          ],
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log("강의별 진행율 불러오기 실패", error);
        }
        setError(true);
      }
    };

    fetchAndDraw();

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-[220px] border rounded-sm flex items-center justify-center text-sm text-error">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  return (
    <div
      ref={chartRef}
      className="w-full h-[220px] border rounded-sm"
      role="region"
      aria-label="수강생 평균 진도율 차트"
    />
  );
}
