import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import NewStudentsByMonthSection from "@/components/dashboard/NewStudentsByMonthSection";
import { getMonthlyStudentStats } from "@/api/dashboard/dashboard";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("@/api/dashboard/dashboard", () => ({
  getMonthlyStudentStats: jest.fn(),
}));

jest.mock("echarts", () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
  })),
}));

const mockGetMonthlyStudentsStats =
  getMonthlyStudentStats as jest.MockedFunction<typeof getMonthlyStudentStats>;

describe("NewStudentsByMonthSection", () => {
  function renderComponent() {
    return render(<NewStudentsByMonthSection />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API 호출 성공 시 그래프를 렌더링한다", async () => {
    mockGetMonthlyStudentsStats.mockResolvedValue(
      createAxiosResponse([
        { month: "2025-01", count: 5 },
        { month: "2025-02", count: 10 },
      ])
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "월별 신규 수강생 현황" })
      ).toBeInTheDocument();
      expect(screen.getByText("단위: 명")).toBeInTheDocument();
    });

    const chartDiv = screen.getByRole("region");
    expect(chartDiv).toBeInTheDocument();
  });

  it("API 호출 실패 시 에러 메시지를 보여준다", async () => {
    mockGetMonthlyStudentsStats.mockRejectedValue(new Error("fail"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("데이터를 불러오는 중 오류가 발생했습니다.")
      ).toBeInTheDocument();
    });
  });
});
