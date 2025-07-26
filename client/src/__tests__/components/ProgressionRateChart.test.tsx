import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProgressionRateChart from "@/components/dashboard/ProgressionRateChart";
import { getCourseAverageProgress } from "@/api/dashboard/dashboard";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";
import type { CourseProgress } from "@/api/dashboard/dashboard";
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

jest.mock("echarts/charts", () => ({
  BarChart: {},
}));

jest.mock("echarts/components", () => ({
  TitleComponent: {},
  TooltipComponent: {},
  GridComponent: {},
  DatasetComponent: {},
}));

jest.mock("echarts/renderers", () => ({
  CanvasRenderer: {},
}));

jest.mock("@/api/dashboard/dashboard", () => ({
  getCourseAverageProgress: jest.fn(),
}));

const mockGetCourseAverageProgress =
  getCourseAverageProgress as jest.MockedFunction<
    typeof getCourseAverageProgress
  >;

describe("ProgressionRateChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API 호출 성공 시 차트 영역을 보여준다", async () => {
    const mockData: CourseProgress[] = [
      { lectureId: 1, lectureTitle: "강의A", avgProgress: 60 },
      { lectureId: 2, lectureTitle: "강의B", avgProgress: 82 },
    ];

    mockGetCourseAverageProgress.mockResolvedValue(
      createAxiosResponse(mockData)
    );

    render(<ProgressionRateChart />);

    const chartDiv = await screen.findByRole("region", {
      name: "수강생 평균 진도율 차트",
    });
    expect(chartDiv).toBeInTheDocument();
    expect(chartDiv).not.toHaveTextContent(
      "데이터를 불러오는 중 오류가 발생했습니다."
    );
  });

  it("API 호출 실패 시 에러 메시지를 보여준다", async () => {
    mockGetCourseAverageProgress.mockRejectedValue(new Error("fail"));

    render(<ProgressionRateChart />);

    const errorMessage = await screen.findByText(
      "데이터를 불러오는 중 오류가 발생했습니다."
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("컴포넌트 언마운트 시 차트가 정리되고 리사이즈 이벤트가 제거된다", async () => {
    const mockChart: Partial<ECharts> = {
      setOption: jest.fn(),
      resize: jest.fn(),
      dispose: jest.fn(),
    };

    const mockInit = jest.mocked(echartsCore.init);
    mockInit.mockReturnValue(mockChart as ECharts);

    const mockData: CourseProgress[] = [
      { lectureId: 1, lectureTitle: "강의A", avgProgress: 60 },
    ];

    mockGetCourseAverageProgress.mockResolvedValue(
      createAxiosResponse(mockData)
    );

    const addEventListenerSpy = jest.spyOn(window, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

    const { unmount } = render(<ProgressionRateChart />);

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalled();
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
    });

    unmount();

    expect(mockChart.dispose).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
