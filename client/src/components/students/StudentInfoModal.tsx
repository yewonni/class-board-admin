"use client";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import Button from "../Button";
import { Student } from "@/types/students/students";
import RadioButton from "../RadioButton";
import { editStudentStatus } from "@/api/students/students";
import { showToast } from "@/utils/toast";

interface StudentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onStudentUpdated?: (
    updatedStudent: Partial<Student> & { id: number }
  ) => void;
  onStatusChange?: (hasChanges: boolean) => void;
}

export function StudentInfoModal({
  isOpen,
  onClose,
  student,
  onStudentUpdated,
  onStatusChange,
}: StudentInfoModalProps) {
  const [status, setStatus] = useState<"활성화" | "비활성화">("비활성화");
  const [originalStatus, setOriginalStatus] = useState<"활성화" | "비활성화">(
    "비활성화"
  );
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status !== originalStatus);
    }
  }, [status, originalStatus, onStatusChange]);

  useEffect(() => {
    if (student) {
      const initialStatus = student.isActive ? "활성화" : "비활성화";
      setStatus(initialStatus);
      setOriginalStatus(initialStatus);
    }
  }, [student]);

  if (!student) return null;

  const handleSaveStatus = async () => {
    if (!student) return;
    try {
      await editStudentStatus({
        id: student.id,
        isActive: status === "활성화",
      });
      setOriginalStatus(status);
      showToast("저장되었습니다.", "success");
      if (onStudentUpdated)
        onStudentUpdated({ id: student.id, isActive: status === "활성화" });
    } catch (error) {
      console.error("상태 저장 실패:", error);
      showToast("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="수강생 상세정보">
      <div className="space-y-4 text-gray-700">
        <p>
          <strong>이름:</strong> {student.name}
        </p>
        <p>
          <strong>이메일:</strong> {student.email}
        </p>
        <p>
          <strong>가입일:</strong> {student.joinDate.split("T")[0]}
        </p>
        <div>
          <strong>상태:</strong>
          <div className="inline-flex gap-4 ml-2">
            <RadioButton
              name="status"
              value="활성화"
              checked={status === "활성화"}
              onChange={() => setStatus("활성화")}
            >
              활성화
            </RadioButton>
            <RadioButton
              name="status"
              value="비활성화"
              checked={status === "비활성화"}
              onChange={() => setStatus("비활성화")}
            >
              비활성화
            </RadioButton>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="font-bold">최근 수강 내역</p>
        {student.recentLectures?.length === 0 ? (
          <p className="text-sm text-gray-500 min-h-11 mt-3 text-center">
            수강 내역이 없습니다.
          </p>
        ) : (
          <table className="min-w-full border-collapse text-sm mt-2">
            <thead>
              <tr className="bg-gray-200 border-b border-b-gray-300 text-gray-900">
                <th className="w-1/4 py-1 px-4 text-center">강의명</th>
                <th className="w-1/4 py-1 px-4 text-center">수강 시작일</th>
                <th className="w-1/4 py-1 px-4 text-center">진도율</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {student.recentLectures?.map((lecture) => (
                <tr
                  key={lecture.id}
                  className="odd:bg-white even:bg-gray-100 text-xs"
                >
                  <td className="py-2 px-4 text-center">{lecture.name}</td>
                  <td className="py-2 px-4 text-center">{lecture.startDate}</td>
                  <td className="py-2 px-4 text-center">{lecture.progress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex gap-2 w-full justify-end mt-5">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button
            onClick={handleSaveStatus}
            disabled={status === originalStatus}
          >
            저장하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
