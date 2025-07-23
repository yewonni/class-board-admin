import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { SIDEBAR_LABELS } from "@/constants/constants";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/dashboard"),
}));

jest.mock("@/store/useAuthStore");

const mockSetAccessToken = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe("Dashboard Page", () => {
  function renderComponent() {
    return render(<DashboardPage />);
  }

  beforeEach(() => {
    mockSetAccessToken.mockReset();
    jest.clearAllMocks();
  });

  it("토큰이 없으면 대시보드 내용이 렌더링되지 않아야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: null,
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.queryByRole("heading", { name: SIDEBAR_LABELS.DASHBOARD })
    ).not.toBeInTheDocument();
  });

  it("토큰이 있으면 대시보드 주요 섹션들이 렌더링되어야 한다", async () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: "valid-token",
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.getByRole("heading", { name: SIDEBAR_LABELS.DASHBOARD })
    ).toBeInTheDocument();

    expect(await screen.findByText("현황 요약")).toBeInTheDocument();
    expect(
      await screen.findByText("월별 신규 수강생 현황")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("강의별 수강생 평균 진도율")
    ).toBeInTheDocument();
    expect(await screen.findByText("인기 강의 TOP 5")).toBeInTheDocument();
    expect(await screen.findByText("최근 알림 5건")).toBeInTheDocument();
  });
});
