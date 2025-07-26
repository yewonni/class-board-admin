import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressionRateByCourseSection from "@/components/dashboard/ProgressionRateByCourseSection";

jest.mock("next/dynamic", () => {
  return () => {
    return function MockProgressionRateChart() {
      return (
        <div data-testid="progression-rate-chart">Mock Chart Component</div>
      );
    };
  };
});

describe("ProgressionRateByCourseSection", () => {
  it("섹션 제목과 설명이 올바르게 렌더링된다", () => {
    render(<ProgressionRateByCourseSection />);

    expect(screen.getByText("강의별 수강생 평균 진도율")).toBeInTheDocument();
    expect(screen.getByText("단위: %")).toBeInTheDocument();
  });

  it("차트 컴포넌트가 렌더링된다", () => {
    render(<ProgressionRateByCourseSection />);

    expect(screen.getByTestId("progression-rate-chart")).toBeInTheDocument();
  });

  it("제목이 올바른 스타일을 가진다", () => {
    render(<ProgressionRateByCourseSection />);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveClass("font-bold", "text-lg", "mb-2");
    expect(title).toHaveTextContent("강의별 수강생 평균 진도율");
  });

  it("단위 설명이 올바른 스타일을 가진다", () => {
    render(<ProgressionRateByCourseSection />);

    const unitDescription = screen.getByText("단위: %");
    expect(unitDescription).toHaveClass("text-xs", "text-gray-400", "mb-2");
  });
});
