import React from "react";
import { render, screen } from "@testing-library/react";
import OverviewSection from "@/components/dashboard/OverviewSection";
import { getStudents } from "@/api/students/students";
import { getLectures } from "@/api/courses/courses";
import { getNotifications } from "@/api/notifications/notifications";
import { getAverageProgress } from "@/api/dashboard/dashboard";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("@/api/students/students", () => ({
  getStudents: jest.fn(),
}));

jest.mock("@/api/courses/courses", () => ({
  getLectures: jest.fn(),
}));

jest.mock("@/api/notifications/notifications", () => ({
  getNotifications: jest.fn(),
}));

jest.mock("@/api/dashboard/dashboard", () => ({
  getAverageProgress: jest.fn(),
}));

const mockGetStudents = getStudents as jest.MockedFunction<typeof getStudents>;
const mockGetLectures = getLectures as jest.MockedFunction<typeof getLectures>;
const mockGetNotifications = getNotifications as jest.MockedFunction<
  typeof getNotifications
>;
const mockGetAverageProgress = getAverageProgress as jest.MockedFunction<
  typeof getAverageProgress
>;

describe("OverviewSection", () => {
  function renderComponent() {
    return render(<OverviewSection />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("전체 수강생 수, 강의 수, 평균 진도율, 알림 수를 모두 정상적으로 표시한다.", async () => {
    mockGetStudents.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalStudentsCount: 42,
      })
    );

    mockGetLectures.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalLecturesCount: 12,
      })
    );

    mockGetAverageProgress.mockResolvedValue(
      createAxiosResponse({
        averageProgress: 78.5,
      })
    );

    mockGetNotifications.mockResolvedValue(
      createAxiosResponse({
        data: [],
        pagination: {
          page: 1,
          limit: 30,
          totalCount: 5,
        },
      })
    );

    renderComponent();

    expect(await screen.findByText("42명")).toBeInTheDocument();
    expect(await screen.findByText("12개")).toBeInTheDocument();
    expect(await screen.findByText("78.5%")).toBeInTheDocument();
    expect(await screen.findByText("5건")).toBeInTheDocument();
  });

  it("수강생 API 실패 시 에러 메시지를 보여준다", async () => {
    mockGetStudents.mockRejectedValue(new Error("fail"));

    mockGetLectures.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalLecturesCount: 10,
      })
    );

    mockGetAverageProgress.mockResolvedValue(
      createAxiosResponse({
        averageProgress: 50,
      })
    );

    mockGetNotifications.mockResolvedValue(
      createAxiosResponse({
        data: [],
        pagination: {
          page: 1,
          limit: 30,
          totalCount: 3,
        },
      })
    );

    renderComponent();

    expect(
      await screen.findByText("수강생 데이터를 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });

  it("강의 API 실패 시 에러 메시지를 보여준다", async () => {
    mockGetStudents.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalStudentsCount: 42,
      })
    );

    mockGetLectures.mockRejectedValue(new Error("fail"));

    mockGetAverageProgress.mockResolvedValue(
      createAxiosResponse({
        averageProgress: 78.5,
      })
    );

    mockGetNotifications.mockResolvedValue(
      createAxiosResponse({
        data: [],
        pagination: {
          page: 1,
          limit: 30,
          totalCount: 5,
        },
      })
    );

    renderComponent();

    expect(
      await screen.findByText("강의 수 데이터를 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });

  it("진도율 API 실패 시 에러 메시지를 보여준다", async () => {
    mockGetStudents.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalStudentsCount: 42,
      })
    );

    mockGetLectures.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalLecturesCount: 12,
      })
    );

    mockGetAverageProgress.mockRejectedValue(new Error("fail"));

    mockGetNotifications.mockResolvedValue(
      createAxiosResponse({
        data: [],
        pagination: {
          page: 1,
          limit: 30,
          totalCount: 5,
        },
      })
    );

    renderComponent();

    expect(
      await screen.findByText("진도율 데이터를 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });

  it("알림 API 실패 시 에러 메시지를 보여준다", async () => {
    mockGetStudents.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalStudentsCount: 42,
      })
    );

    mockGetLectures.mockResolvedValue(
      createAxiosResponse({
        data: [],
        totalLecturesCount: 12,
      })
    );

    mockGetAverageProgress.mockResolvedValue(
      createAxiosResponse({
        averageProgress: 78.5,
      })
    );

    mockGetNotifications.mockRejectedValue(new Error("fail"));

    renderComponent();

    expect(
      await screen.findByText("알림 수 데이터를 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });
});
