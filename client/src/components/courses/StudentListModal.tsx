import Modal from "../Modal";
import Button from "../Button";

interface Student {
  id: number;
  name: string;
  email: string;
}

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export function StudentListModal({
  isOpen,
  onClose,
  students,
}: StudentListModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="전체 수강생 목록">
      <ul className="space-y-2 text-gray-700 text-sm max-h-[300px] overflow-y-auto">
        {students.length === 0 ? (
          <li className="text-center">수강생이 없습니다.</li>
        ) : (
          students.map((student) => (
            <li key={student.id}>
              • {student.name} ({student.email})
            </li>
          ))
        )}
      </ul>
      <div className="flex justify-end mt-4">
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </div>
    </Modal>
  );
}
