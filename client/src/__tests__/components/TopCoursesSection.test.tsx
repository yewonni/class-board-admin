import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TopCoursesSection from "@/components/dashboard/TopCoursesSection";
import { getLectures } from "@/api/courses/courses";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("@/api/courses/courses", () => ({
  getLectures: jest.fn(),
}));

const mockGetLectures = getLectures as jest.MockedFunction<typeof getLectures>;

const mockLectures = [
  {
    id: 1,
    title: "강의A",
    instructor: "강사A",
    openDate: "2025-01-01",
    status: "진행중",
    studentCount: 100,
  },
  {
    id: 2,
    title: "강의B",
    instructor: "강사B",
    openDate: "2025-01-01",
    status: "진행중",
    studentCount: 90,
  },
  {
    id: 3,
    title: "강의C",
    instructor: "강사C",
    openDate: "2025-01-01",
    status: "종료",
    studentCount: 80,
  },
  {
    id: 4,
    title: "강의D",
    instructor: "강사D",
    openDate: "2025-01-01",
    status: "진행중",
    studentCount: 70,
  },
  {
    id: 5,
    title: "강의E",
    instructor: "강사E",
    openDate: "2025-01-01",
    status: "진행중",
    studentCount: 60,
  },
  {
    id: 6,
    title: "강의F",
    instructor: "강사F",
    openDate: "2025-01-01",
    status: "진행중",
    studentCount: 50,
  },
];

describe("TopCoursesSection", () => {
  function renderComponent() {
    return render(<TopCoursesSection />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("API 호출 성공 시 인기 강의 5개가 렌더링된다", async () => {
    mockGetLectures.mockResolvedValue(
      createAxiosResponse({
        data: mockLectures,
        totalLecturesCount: mockLectures.length,
      })
    );
    renderComponent();

    expect(
      screen.getByRole("heading", { name: "인기 강의 TOP 5" })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("강의A")).toBeInTheDocument();
      expect(screen.getByText("강의B")).toBeInTheDocument();
      expect(screen.queryByText("강의C")).not.toBeInTheDocument();
      expect(screen.getByText("강의D")).toBeInTheDocument();
      expect(screen.getByText("강의E")).toBeInTheDocument();
      expect(screen.getByText("강의F")).toBeInTheDocument();
    });

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("API 호출 실패 시 에러 메시지를 보여준다", async () => {
    mockGetLectures.mockRejectedValue(new Error("fail"));

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText("인기 강의 데이터를 불러오는 데 실패했습니다.")
      ).toBeInTheDocument();
    });
  });
});
