import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NewStudentsChart from "@/components/dashboard/NewStudentsChart";
import { getMonthlyStudentStats } from "@/api/dashboard/dashboard";
import type { MonthlyStudentStat } from "@/api/dashboard/dashboard";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";
import * as echartsCore from "echarts/core";
import type { ECharts } from "echarts/core";

jest.mock("echarts/core", () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  })),
  use: jest.fn(),
}));

jest.mock("echarts/charts", () => ({ LineChart: {} }));
jest.mock("echarts/components", () => ({
  TooltipComponent: {},
  GridComponent: {},
  TitleComponent: {},
  DatasetComponent: {},
  TransformComponent: {},
}));
jest.mock("echarts/renderers", () => ({
  CanvasRenderer: {},
}));

jest.mock("@/api/dashboard/dashboard", () => ({
  getMonthlyStudentStats: jest.fn(),
}));

const mockGetMonthlyStudentStats =
  getMonthlyStudentStats as jest.MockedFunction<typeof getMonthlyStudentStats>;

describe("NewStudentsChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API 호출 성공 시 차트를 렌더링한다", async () => {
    const mockData: MonthlyStudentStat[] = [
      { month: "2024-01", count: 10 },
      { month: "2024-02", count: 25 },
    ];

    mockGetMonthlyStudentStats.mockResolvedValue(createAxiosResponse(mockData));

    render(<NewStudentsChart />);

    const chart = await screen.findByRole("region", {
      name: "신규 수강생 차트",
    });
    expect(chart).toBeInTheDocument();
  });

  it("API 호출 실패 시 에러 메시지를 렌더링한다", async () => {
    mockGetMonthlyStudentStats.mockRejectedValue(new Error("fail"));

    render(<NewStudentsChart />);

    const error = await screen.findByText(
      "데이터를 불러오는 중 오류가 발생했습니다."
    );
    expect(error).toBeInTheDocument();
  });

  it("언마운트 시 차트 dispose 및 이벤트 제거가 정상 동작한다", async () => {
    const mockChart: Partial<ECharts> = {
      setOption: jest.fn(),
      resize: jest.fn(),
      dispose: jest.fn(),
    };

    const mockInit = jest.mocked(echartsCore.init);
    mockInit.mockReturnValue(mockChart as ECharts);

    const mockData: MonthlyStudentStat[] = [{ month: "2024-01", count: 15 }];
    mockGetMonthlyStudentStats.mockResolvedValue(createAxiosResponse(mockData));

    const addEventSpy = jest.spyOn(window, "addEventListener");
    const removeEventSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<NewStudentsChart />);

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalled();
      expect(addEventSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    });

    unmount();

    expect(mockChart.dispose).toHaveBeenCalled();
    expect(removeEventSpy).toHaveBeenCalledWith("resize", expect.any(Function));

    addEventSpy.mockRestore();
    removeEventSpy.mockRestore();
  });
});
