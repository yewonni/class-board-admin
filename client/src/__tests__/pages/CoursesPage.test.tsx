import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CoursesPage from "@/app/courses/page";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { getLectures } from "@/api/courses/courses";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";
import { SIDEBAR_LABELS } from "@/constants/constants";
import userEvent from "@testing-library/user-event";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/courses"),
}));

jest.mock("@/store/useAuthStore");

jest.mock("@/api/courses/courses", () => ({
  getLectures: jest.fn(),
}));

jest.mock("@/store/useLoadingStore", () => ({
  useLoadingStore: jest.fn(() => false),
}));

const mockSetAccessToken = jest.fn();
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockGetLectures = getLectures as jest.MockedFunction<typeof getLectures>;

describe("CoursesPage", () => {
  function renderComponent() {
    return render(<CoursesPage />);
  }

  beforeEach(() => {
    mockSetAccessToken.mockReset();
    jest.clearAllMocks();
    mockGetLectures.mockResolvedValue(
      createAxiosResponse({
        data: [
          {
            id: 1,
            title: "강의A",
            instructor: "강사1",
            openDate: "2025-09-09T12:00:00.000Z",
            status: "예정",
            studentCount: 13,
          },
          {
            id: 1,
            title: "강의B",
            instructor: "강사2",
            openDate: "2025-05-12T12:00:00.000Z",
            status: "진행중",
            studentCount: 5,
          },
        ],
        pagination: { page: 1, limit: 20, totalCount: 2 },
        totalLecturesCount: 2,
      })
    );
  });

  it("토큰이 없으면 강의 관리 내용이 렌더링되지 않아야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: null,
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.queryByRole("heading", { name: SIDEBAR_LABELS.COURSES })
    ).not.toBeInTheDocument();
  });

  it("토큰이 있으면 강의 관리 내용이 렌더링되어야 한다", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: "valid-token",
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.getByRole("heading", { name: SIDEBAR_LABELS.COURSES })
    ).toBeInTheDocument();
  });

  it("강의명 검색 시 필터링된 강의 목록이 보여야 한다", async () => {
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
    const input = screen.getByPlaceholderText("강의명 입력");

    await waitFor(() => {
      expect(screen.getByText("강의A")).toBeInTheDocument();
    });
    expect(screen.getByText("강의B")).toBeInTheDocument();

    mockGetLectures.mockResolvedValueOnce(
      createAxiosResponse({
        data: [
          {
            id: 1,
            title: "강의A",
            instructor: "강사1",
            openDate: "2025-09-09T12:00:00.000Z",
            status: "예정",
            studentCount: 13,
          },
        ],
        pagination: { page: 1, limit: 20, totalCount: 2 },
        totalLecturesCount: 1,
      })
    );
    await user.clear(input);
    await user.type(input, "A");

    await waitFor(
      () => {
        expect(screen.getByText("강의A")).toBeInTheDocument();
        expect(screen.queryByText("강의B")).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
