import React from "react";
import { screen, render } from "@testing-library/react";
import { StudentListModal } from "@/components/courses/StudentListModal";

const mockStudents = [
  {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
  },
  {
    id: 2,
    name: "김영희",
    email: "kim@example.com",
  },
];

describe("StudentListModal", () => {
  it("해당 강의를 듣는 수강생 정보를 렌더링한다.", async () => {
    render(
      <StudentListModal
        isOpen={true}
        onClose={jest.fn()}
        students={mockStudents}
      />
    );

    expect(await screen.findByText("홍길동")).toBeInTheDocument();
    expect(await screen.findByText("hong@example.com")).toBeInTheDocument();
    expect(await screen.findByText("김영희")).toBeInTheDocument();
    expect(await screen.findByText("kim@example.com")).toBeInTheDocument();
  });
});
