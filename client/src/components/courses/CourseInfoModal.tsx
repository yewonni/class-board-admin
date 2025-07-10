"use client";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { Courses } from "@/types/courses/courses";
import RadioButton from "../RadioButton";
import { editCourseStatus } from "@/api/courses/courses";
import { showToast } from "@/utils/toast";

interface CourseInfoPropsType {
  isOpen: boolean;
  onClose: () => void;
  course: Courses | null;
  onShowStudents: () => void;
  onCourseUpdated?: (updatedStudent: Partial<Courses> & { id: number }) => void;
  onStatusChange?: (hasChanges: boolean) => void;
}

export function CourseInfoModal({
  isOpen,
  onClose,
  course,
  onShowStudents,
  onCourseUpdated,
  onStatusChange,
}: CourseInfoPropsType) {
  const [status, setStatus] = useState<string>("예정");
  const [originalStatus, setOriginalStatus] = useState<string>("예정");

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status !== originalStatus);
    }
  }, [status, originalStatus, onStatusChange]);

  useEffect(() => {
    if (course) {
      const initialStatus = course.status;
      setStatus(initialStatus);
      setOriginalStatus(initialStatus);
    }
  }, [course]);

  if (!course) return null;

  const handleSaveStatus = async () => {
    if (!course) return;
    try {
      await editCourseStatus({
        id: course.id,
        status,
      });
      setOriginalStatus(status);
      showToast("저장되었습니다.", "success");
      if (onCourseUpdated) onCourseUpdated({ id: course.id, status });
    } catch (error) {
      console.error("상태 저장 실패:", error);
      showToast("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="강의 상세정보">
      <div className="space-y-4 text-gray-700">
        <p>
          <strong>강의명:</strong> {course.title}
        </p>
        <p>
          <strong>강사:</strong> {course.instructor}
        </p>
        <p>
          <strong>개설일:</strong> {course.openDate.split("T")[0]}
        </p>

        <div>
          <strong>상태:</strong>
          <div className="inline-flex gap-4 ml-2">
            <RadioButton
              name="status"
              value="예정"
              checked={status === "예정"}
              onChange={() => setStatus("예정")}
            >
              예정
            </RadioButton>
            <RadioButton
              name="status"
              value="진행중"
              checked={status === "진행중"}
              onChange={() => setStatus("진행중")}
            >
              진행중
            </RadioButton>
            <RadioButton
              name="status"
              value="종료"
              checked={status === "종료"}
              onChange={() => setStatus("종료")}
            >
              종료
            </RadioButton>
          </div>
        </div>
        <div className="border-t border-t-gray-200 flex flex-col gap-2 pt-3">
          <p className="flex items-center gap-2">
            <strong>수강생 수:</strong> {course.studentCount}명
            {course.studentCount !== 0 && (
              <button
                className="text-primary text-sm underline hover:text-primaryHover transition"
                onClick={onShowStudents}
              >
                전체 수강생 보기
              </button>
            )}
          </p>
        </div>
      </div>

      <div className="flex gap-2 w-full justify-end mt-5">
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button onClick={handleSaveStatus} disabled={status === originalStatus}>
          저장하기
        </Button>
      </div>
    </Modal>
  );
}
