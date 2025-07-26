import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CoursesTable from "@/components/courses/CoursesTable";
import { Courses } from "@/types/courses/courses";

const mockCourses: Courses[] = [
  {
    id: 1,
    title: "강의A",
    instructor: "강사1",
    openDate: "2025-09-09T12:00:00.000Z",
    status: "예정",
    studentCount: 13,
  },
  {
    id: 2,
    title: "강의B",
    instructor: "강사2",
    openDate: "2025-03-15T12:00:00.000Z",
    status: "진행중",
    studentCount: 9,
  },
];

describe("CoursesTable", () => {
  it("강의 목록을 정상적으로 렌더링한다", async () => {
    render(<CoursesTable data={mockCourses} onRowClick={jest.fn()} />);

    expect(await screen.findByText("강의A")).toBeInTheDocument();
    expect(await screen.findByText("예정")).toBeInTheDocument();
    expect(await screen.findByText("강의B")).toBeInTheDocument();
    expect(await screen.findByText("진행중")).toBeInTheDocument();
  });

  it("각 row 클릭 시 onRowClick이 호출된다", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<CoursesTable data={mockCourses} onRowClick={handleClick} />);

    const row = await screen.findByText("강의A");
    await user.click(row);

    expect(handleClick).toHaveBeenCalledWith(mockCourses[0]);
  });
});
