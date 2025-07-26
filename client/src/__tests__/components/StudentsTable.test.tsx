import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudentsTable from "@/components/students/StudentsTable";
import { Student } from "@/types/students/students";

const mockStudents: Student[] = [
  {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    joinDate: "2025-07-01T12:00:00.000Z",
    isActive: true,
    recentLectures: [],
  },
  {
    id: 2,
    name: "김영희",
    email: "kim@example.com",
    joinDate: "2025-06-15T12:00:00.000Z",
    isActive: false,
    recentLectures: [],
  },
];

describe("StudentsTable", () => {
  it("수강생 목록을 정상적으로 렌더링한다", async () => {
    render(<StudentsTable data={mockStudents} onRowClick={jest.fn()} />);

    expect(await screen.findByText("홍길동")).toBeInTheDocument();
    expect(await screen.findByText("김영희")).toBeInTheDocument();
    expect(await screen.findByText("hong@example.com")).toBeInTheDocument();
    expect(await screen.findByText("kim@example.com")).toBeInTheDocument();
    expect(await screen.findByText("2025-07-01")).toBeInTheDocument();
    expect(await screen.findByText("2025-06-15")).toBeInTheDocument();
    expect(await screen.findByText("활성화")).toBeInTheDocument();
    expect(await screen.findByText("비활성화")).toBeInTheDocument();
  });

  it("각 row 클릭 시 onRowClick이 호출된다", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<StudentsTable data={mockStudents} onRowClick={handleClick} />);

    const row = await screen.findByText("홍길동");
    await user.click(row);

    expect(handleClick).toHaveBeenCalledWith(mockStudents[0]);
  });
});
