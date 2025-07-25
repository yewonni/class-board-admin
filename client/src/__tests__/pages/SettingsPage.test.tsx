import React from "react";
import { render, screen } from "@testing-library/react";
import SettingsPage from "@/app/settings/page";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { SIDEBAR_LABELS } from "@/constants/constants";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/settings"),
}));

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

const mockSetAccessToken = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

describe("Settings Page", () => {
  function renderComponent() {
    return render(<SettingsPage />);
  }

  beforeEach(() => {
    mockSetAccessToken.mockReset();
  });

  it("토큰이 없으면 설정 내용이 렌더링되지 않아야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) => {
      const state: AuthState = {
        accessToken: null,
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      };
      return selector(state);
    });

    renderComponent();

    expect(
      screen.queryByRole("heading", { name: SIDEBAR_LABELS.SETTINGS })
    ).not.toBeInTheDocument();
  });

  it("토큰이 있으면 설정 내용이 렌더링되어야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) => {
      const state: AuthState = {
        accessToken: "valid-token",
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      };
      return selector(state);
    });

    renderComponent();

    expect(
      screen.getByRole("heading", { name: SIDEBAR_LABELS.SETTINGS })
    ).toBeInTheDocument();
  });
});
