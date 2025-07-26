import React from "react";
import { render, screen } from "@testing-library/react";
import NewStudentsByMonthSection from "@/components/dashboard/NewStudentsByMonthSection";

// dynamic import mock
jest.mock("next/dynamic", () => {
  return () => {
    function MockChart() {
      return (
        <div data-testid="new-students-chart">Mock New Students Chart</div>
      );
    }
    return MockChart;
  };
});

describe("NewStudentsByMonthSection", () => {
  it("섹션 제목과 설명이 올바르게 렌더링된다", () => {
    render(<NewStudentsByMonthSection />);

    expect(screen.getByText("월별 신규 수강생 현황")).toBeInTheDocument();
    expect(screen.getByText("단위: 명")).toBeInTheDocument();
  });

  it("차트 컴포넌트가 렌더링된다", () => {
    render(<NewStudentsByMonthSection />);
    expect(screen.getByTestId("new-students-chart")).toBeInTheDocument();
  });

  it("제목이 올바른 스타일을 가진다", () => {
    render(<NewStudentsByMonthSection />);

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveClass("font-bold", "text-lg", "mb-2");
    expect(title).toHaveTextContent("월별 신규 수강생 현황");
  });

  it("단위 설명이 올바른 스타일을 가진다", () => {
    render(<NewStudentsByMonthSection />);

    const unit = screen.getByText("단위: 명");
    expect(unit).toHaveClass("text-xs", "text-gray-400", "mb-2");
  });
});
