"use client";
import React, { useEffect, useRef, useState } from "react";

import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TooltipComponent,
  GridComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { getMonthlyStudentStats } from "@/api/dashboard/dashboard";

echarts.use([
  LineChart,
  TooltipComponent,
  GridComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
  CanvasRenderer,
]);

export default function NewStudentsChart() {
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

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
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
      aria-label="신규 수강생 차트"
    />
  );
}
