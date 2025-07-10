import Modal from "../Modal";
import Button from "../Button";
import { StudentByCourse } from "@/types/courses/courses";

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentByCourse[];
}

export function StudentListModal({
  isOpen,
  onClose,
  students,
}: StudentListModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="전체 수강생 목록">
      <div className="max-h-[300px] overflow-y-auto space-y-2 mt-4">
        {students.length === 0 ? (
          <p className="text-center text-gray-500">수강생이 없습니다.</p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between px-4 py-2 bg-white shadow-sm rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end mt-6">
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </div>
    </Modal>
  );
}
