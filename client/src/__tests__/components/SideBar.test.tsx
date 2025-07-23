import React from "react";

import { render, screen } from "@testing-library/react";
import SideBar, { SIDEBAR_MENUS } from "@/components/SideBar";

jest.mock("next/navigation", () => ({
  usePathname: () => "/students",
}));

describe("SideBar", () => {
  function renderComponent() {
    return render(<SideBar />);
  }

  it("사이드바 모든 메뉴가 렌더링된다", () => {
    renderComponent();
    SIDEBAR_MENUS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
    expect(screen.getByAltText("클래스보드 로고")).toBeInTheDocument();
  });

  it("현재 경로에 해당하는 메뉴만 활성화 배경 색상이 적용된다", () => {
    renderComponent();
    const activeMenu = screen.getByText("수강생 관리");
    expect(activeMenu.closest("a")).toHaveClass("bg-primaryActive");
  });

  it("각 메뉴는 정확한 href를 가진 링크이다", () => {
    renderComponent();
    SIDEBAR_MENUS.forEach(({ label, href }) => {
      const link = screen.getByText(label).closest("a");
      expect(link).toHaveAttribute("href", href);
    });
  });
});
