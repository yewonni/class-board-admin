import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StudentInfoModal } from "@/components/students/StudentInfoModal";
import { editStudentStatus } from "@/api/students/students";
import { showToast } from "@/utils/toast";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("@/api/students/students");
jest.mock("@/utils/toast");

const mockEditStudentStatus = editStudentStatus as jest.MockedFunction<
  typeof editStudentStatus
>;
const mockShowToast = showToast as jest.MockedFunction<typeof showToast>;

const sampleStudent = {
  id: 1,
  name: "홍길동",
  email: "hong@example.com",
  joinDate: "2025-07-01T12:00:00.000Z",
  isActive: true,
  recentLectures: [
    { id: 1, name: "React 기초", startDate: "2025-06-01", progress: "50%" },
    { id: 2, name: "TypeScript", startDate: "2025-06-10", progress: "75%" },
  ],
};

describe("StudentInfoModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("학생 정보와 최근 수강 내역을 정상적으로 렌더링한다", () => {
    render(
      <StudentInfoModal
        isOpen={true}
        onClose={jest.fn()}
        student={sampleStudent}
      />
    );

    expect(screen.getByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("hong@example.com")).toBeInTheDocument();
    expect(screen.getByText("2025-07-01")).toBeInTheDocument();

    expect(screen.getByRole("radio", { name: "활성화" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "비활성화" })).not.toBeChecked();

    expect(screen.getByText("React 기초")).toBeInTheDocument();
    expect(screen.getByText("2025-06-01")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("2025-06-10")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("상태 변경 시 저장 버튼 활성화/비활성화가 반영된다", async () => {
    const user = userEvent.setup();
    render(
      <StudentInfoModal
        isOpen={true}
        onClose={jest.fn()}
        student={sampleStudent}
      />
    );

    const saveButton = screen.getByRole("button", { name: "저장하기" });

    expect(saveButton).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "비활성화" }));

    expect(saveButton).toBeEnabled();

    await user.click(screen.getByRole("radio", { name: "활성화" }));
    expect(saveButton).toBeDisabled();
  });

  it("저장하기 클릭 시 API 호출 후 토스트와 onStudentUpdated 호출", async () => {
    const user = userEvent.setup();
    const onStudentUpdated = jest.fn();
    mockEditStudentStatus.mockResolvedValue(createAxiosResponse({}));

    render(
      <StudentInfoModal
        isOpen={true}
        onClose={jest.fn()}
        student={sampleStudent}
        onStudentUpdated={onStudentUpdated}
      />
    );

    await user.click(screen.getByRole("radio", { name: "비활성화" }));

    await user.click(screen.getByRole("button", { name: "저장하기" }));

    await waitFor(() => {
      expect(mockEditStudentStatus).toHaveBeenCalledWith({
        id: sampleStudent.id,
        isActive: false,
      });
      expect(mockShowToast).toHaveBeenCalledWith("저장되었습니다.", "success");
      expect(onStudentUpdated).toHaveBeenCalledWith({
        id: sampleStudent.id,
        isActive: false,
      });
    });
  });

  it("저장 실패 시 에러 토스트를 띄운다", async () => {
    const user = userEvent.setup();
    mockEditStudentStatus.mockRejectedValue(new Error("fail"));

    render(
      <StudentInfoModal
        isOpen={true}
        onClose={jest.fn()}
        student={sampleStudent}
      />
    );

    await user.click(screen.getByRole("radio", { name: "비활성화" }));

    await user.click(screen.getByRole("button", { name: "저장하기" }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "저장에 실패했습니다. 다시 시도해주세요."
      );
    });
  });

  it("닫기 버튼 클릭 시 onClose 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <StudentInfoModal
        isOpen={true}
        onClose={onClose}
        student={sampleStudent}
      />
    );

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalled();
  });
});
