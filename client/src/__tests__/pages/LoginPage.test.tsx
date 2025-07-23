import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";
import * as authApi from "@/api/auth/login";
import { useRouter } from "next/navigation";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

// 모킹 작업
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@/api/auth/login", () => ({
  login: jest.fn(),
}));

const mockSetAccessToken = jest.fn();
const mockPush = jest.fn();

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockLogin = authApi.login as jest.MockedFunction<typeof authApi.login>;
const mockUseRouter = useRouter as jest.Mock;

describe("LoginPage", () => {
  function renderComponent() {
    return render(<LoginPage />);
  }

  beforeEach(() => {
    mockUseAuthStore.mockImplementation(
      (selector: (state: AuthState) => unknown) => {
        const mockState: AuthState = {
          accessToken: null,
          setAccessToken: mockSetAccessToken,
          logout: jest.fn(),
        };
        return selector(mockState);
      }
    );

    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as Partial<ReturnType<typeof useRouter>>);

    mockSetAccessToken.mockReset();
    mockPush.mockReset();
    mockLogin.mockReset();
  });

  it("이메일과 비밀번호 입력 후 로그인 시도하면 로그인 API 호출, 토큰 저장, 대시보드 이동이 되어야 한다", async () => {
    const user = userEvent.setup();

    mockLogin.mockResolvedValue(
      createAxiosResponse({ accessToken: "test-access-token" })
    );

    renderComponent();

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요");
    const passwordInput =
      screen.getByPlaceholderText("비밀번호를 입력해주세요");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "12345678");
    await user.click(loginButton);

    expect(mockLogin).toHaveBeenCalledWith("test@example.com", "12345678");

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith("test-access-token");
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("로그인 실패 시 에러 메시지가 화면에 보여야 한다", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValue({
      response: {
        data: {
          message: "잘못된 이메일 또는 비밀번호입니다.",
        },
      },
    });

    renderComponent();

    const emailInput = screen.getByPlaceholderText("이메일을 입력해주세요");
    const passwordInput =
      screen.getByPlaceholderText("비밀번호를 입력해주세요");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    await user.type(emailInput, "wrong@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(loginButton);

    const errorMsg = await screen.findByText(
      "잘못된 이메일 또는 비밀번호입니다."
    );
    expect(errorMsg).toBeInTheDocument();

    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
