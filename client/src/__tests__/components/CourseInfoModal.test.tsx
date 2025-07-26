import React from "react";
import { screen, render, waitFor } from "@testing-library/react";
import { CourseInfoModal } from "@/components/courses/CourseInfoModal";
import { editCourseStatus } from "@/api/courses/courses";
import userEvent from "@testing-library/user-event";
import { showToast } from "@/utils/toast";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

jest.mock("@/api/courses/courses");
jest.mock("@/utils/toast");

const mockEditCourseStatus = editCourseStatus as jest.MockedFunction<
  typeof editCourseStatus
>;
const mockShowToast = showToast as jest.MockedFunction<typeof showToast>;

const sampleCourse = {
  id: 1,
  title: "강의A",
  instructor: "강사1",
  openDate: "2025-09-09T12:00:00.000Z",
  status: "예정",
  studentCount: 13,
};

describe("CourseInfoModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("강의 정보를 정상적으로 렌더링한다.", () => {
    render(
      <CourseInfoModal
        isOpen={true}
        onClose={jest.fn()}
        course={sampleCourse}
        onShowStudents={jest.fn()}
      />
    );

    expect(screen.getByText("강의A")).toBeInTheDocument();
    expect(screen.getByText("강사1")).toBeInTheDocument();
    expect(screen.getByText("2025-09-09")).toBeInTheDocument();
    expect(screen.getByText("예정")).toBeInTheDocument();

    expect(screen.getByRole("radio", { name: "예정" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "진행중" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "종료" })).not.toBeChecked();
  });

  it("상태 변경 시 저장 버튼 활성화/비활성화가 반영된다", async () => {
    const user = userEvent.setup();
    render(
      <CourseInfoModal
        isOpen={true}
        onClose={jest.fn()}
        course={sampleCourse}
        onShowStudents={jest.fn()}
      />
    );

    const saveButton = screen.getByRole("button", { name: "저장하기" });
    expect(saveButton).toBeDisabled();

    await user.click(screen.getByRole("radio", { name: "진행중" }));
    expect(saveButton).toBeEnabled();

    await user.click(screen.getByRole("radio", { name: "예정" }));
    expect(saveButton).toBeDisabled();
  });

  it("저장하기 클릭 시 API 호출 후 토스트와 onCourseUpdated 호출", async () => {
    const user = userEvent.setup();
    const onCourseUpdated = jest.fn();
    mockEditCourseStatus.mockResolvedValueOnce(createAxiosResponse({}));

    render(
      <CourseInfoModal
        isOpen={true}
        onClose={jest.fn()}
        course={sampleCourse}
        onShowStudents={jest.fn()}
        onCourseUpdated={onCourseUpdated}
      />
    );

    await user.click(screen.getByRole("radio", { name: "진행중" }));
    await user.click(screen.getByRole("button", { name: "저장하기" }));

    await waitFor(() => {
      expect(mockEditCourseStatus).toHaveBeenCalledWith({
        id: sampleCourse.id,
        status: "진행중",
      });
      expect(mockShowToast).toHaveBeenCalledWith("저장되었습니다.", "success");
      expect(onCourseUpdated).toHaveBeenCalledWith({
        id: sampleCourse.id,
        status: "진행중",
      });
    });
  });

  it("저장 실패 시 에러 토스트를 띄운다", async () => {
    const user = userEvent.setup();
    mockEditCourseStatus.mockRejectedValueOnce(new Error("fail"));

    render(
      <CourseInfoModal
        isOpen={true}
        onClose={jest.fn()}
        course={sampleCourse}
        onShowStudents={jest.fn()}
      />
    );

    await user.click(screen.getByRole("radio", { name: "진행중" }));
    await user.click(screen.getByRole("button", { name: "저장하기" }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "저장에 실패했습니다. 다시 시도해주세요."
      );
    });
  });

  it("수강생 수가 0명일 경우 '전체 수강생 보기' 버튼이 렌더링되지 않는다", () => {
    render(
      <CourseInfoModal
        isOpen={true}
        onClose={jest.fn()}
        course={{ ...sampleCourse, studentCount: 0 }}
        onShowStudents={jest.fn()}
      />
    );
    expect(screen.queryByText("전체 수강생 보기")).not.toBeInTheDocument();
  });

  it("수강생 보기 버튼 클릭 시 onShowStudents 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onShowStudents = jest.fn();

    render(
      <CourseInfoModal
        isOpen={true}
        onClose={jest.fn()}
        course={sampleCourse}
        onShowStudents={onShowStudents}
      />
    );

    await user.click(screen.getByText("전체 수강생 보기"));
    expect(onShowStudents).toHaveBeenCalled();
  });

  it("닫기 버튼 클릭 시 onClose 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <CourseInfoModal
        isOpen={true}
        onClose={onClose}
        course={sampleCourse}
        onShowStudents={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalled();
  });
});
