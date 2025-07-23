import React from "react";
import { render, screen } from "@testing-library/react";
import NotificationsPage from "@/app/notifications/page";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { SIDEBAR_LABELS } from "@/constants/constants";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/notifications"),
}));

jest.mock("@/store/useAuthStore");

const mockSetAccessToken = jest.fn();

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe("Notifications Page", () => {
  function renderComponent() {
    return render(<NotificationsPage />);
  }

  beforeEach(() => {
    mockSetAccessToken.mockReset();
  });

  it("토큰이 없으면 알림센터 내용이 렌더링되지 않아야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: null,
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.queryByRole("heading", { name: SIDEBAR_LABELS.NOTIFICATIONS })
    ).not.toBeInTheDocument();
  });

  it("토큰이 있으면 알림센터 내용이 렌더링되어야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: "valid-token",
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.getByRole("heading", { name: SIDEBAR_LABELS.NOTIFICATIONS })
    ).toBeInTheDocument();
  });
});
