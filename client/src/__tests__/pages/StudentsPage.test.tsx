import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentsPage from "@/app/students/page";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { SIDEBAR_LABELS } from "@/constants/constants";
import { getStudents } from "@/api/students/students";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/students"),
}));

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: jest.fn(),
}));

jest.mock("@/api/students/students", () => ({
  getStudents: jest.fn(),
}));

jest.mock("@/store/useLoadingStore", () => ({
  useLoadingStore: jest.fn(() => false),
}));

const mockSetAccessToken = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockGetStudents = getStudents as jest.MockedFunction<typeof getStudents>;

describe("Students Page", () => {
  function renderComponent() {
    return render(<StudentsPage />);
  }

  beforeEach(() => {
    mockSetAccessToken.mockReset();
    mockGetStudents.mockResolvedValue(
      createAxiosResponse({
        data: [
          {
            id: 1,
            name: "홍길동",
            email: "hong@example.com",
            joinDate: "2024-01-01T00:00:00",
            isActive: true,
            recentLectures: [],
          },
          {
            id: 2,
            name: "김유진",
            email: "kim@example.com",
            joinDate: "2024-01-02T00:00:00",
            isActive: true,
            recentLectures: [],
          },
        ],
        pagination: { page: 1, limit: 20, totalCount: 2 },
        totalStudentsCount: 2,
      })
    );
  });

  it("토큰이 없으면 수강생 관리 내용이 렌더링되지 않아야 한다", () => {
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
      screen.queryByRole("heading", { name: SIDEBAR_LABELS.STUDENTS })
    ).not.toBeInTheDocument();
  });

  it("토큰이 있으면 수강생 내용이 렌더링되어야 한다", () => {
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
      screen.getByRole("heading", { name: SIDEBAR_LABELS.STUDENTS })
    ).toBeInTheDocument();
  });

  it("이름 또는 이메일 검색 시 필터링된 수강생이 보여야 한다", async () => {
    mockUseAuthStore.mockImplementation((selector) => {
      const state: AuthState = {
        accessToken: "valid-token",
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      };
      return selector(state);
    });

    renderComponent();

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText("이름, 이메일 입력");

    await waitFor(() => {
      expect(screen.getByText("홍길동")).toBeInTheDocument();
    });

    expect(screen.getByText("김유진")).toBeInTheDocument();

    mockGetStudents.mockResolvedValueOnce(
      createAxiosResponse({
        data: [
          {
            id: 1,
            name: "홍길동",
            email: "hong@example.com",
            joinDate: "2024-01-01T00:00:00",
            isActive: true,
            recentLectures: [],
          },
        ],
        pagination: { page: 1, limit: 20, totalCount: 1 },
        totalStudentsCount: 1,
      })
    );

    await user.clear(input);
    await user.type(input, "홍");

    await waitFor(
      () => {
        expect(screen.getByText("홍길동")).toBeInTheDocument();
        expect(screen.queryByText("김유진")).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
