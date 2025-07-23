import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ProgressionRateByCourseSection from "@/components/dashboard/ProgressionRateByCourseSection";
import { getCourseAverageProgress } from "@/api/dashboard/dashboard";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("@/api/dashboard/dashboard", () => ({
  getCourseAverageProgress: jest.fn(),
}));

jest.mock("echarts", () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  })),
}));

const mockGetCourseAverageProgress =
  getCourseAverageProgress as jest.MockedFunction<
    typeof getCourseAverageProgress
  >;

describe("ProgressionRateByCourseSection", () => {
  function renderComponent() {
    return render(<ProgressionRateByCourseSection />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API 호출 성공 시 그래프를 렌더링한다", async () => {
    mockGetCourseAverageProgress.mockResolvedValue(
      createAxiosResponse([
        { lectureId: 1, lectureTitle: "강의A", avgProgress: 60 },
        { lectureId: 2, lectureTitle: "강의B", avgProgress: 82 },
      ])
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "강의별 수강생 평균 진도율" })
      ).toBeInTheDocument();
      expect(screen.getByText("단위: %")).toBeInTheDocument();
    });

    const chartDiv = screen.getByRole("region");
    expect(chartDiv).toBeInTheDocument();
  });

  it("API 호출 실패 시 에러 메시지를 보여준다", async () => {
    mockGetCourseAverageProgress.mockRejectedValue(new Error("fail"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("데이터를 불러오는 중 오류가 발생했습니다.")
      ).toBeInTheDocument();
    });
  });
});
