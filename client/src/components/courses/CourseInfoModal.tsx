import Modal from "../Modal";
import Button from "../Button";

interface Courses {
  id: number;
  title: string;
  instructor: string;
  studentCount: number;
  openDate: string;
  status: string;
  progress: string;
}

interface CourseInfoPropsType {
  isOpen: boolean;
  onClose: () => void;
  course: Courses | null;
  onShowStudents: () => void;
}

export function CourseInfoModal({
  isOpen,
  onClose,
  course,
  onShowStudents,
}: CourseInfoPropsType) {
  if (!course) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="강의 상세정보">
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>강의명:</strong> {course.title}
        </p>
        <p>
          <strong>강사:</strong> {course.instructor}
        </p>
        <p>
          <strong>개설일:</strong> {course.openDate}
        </p>
        <p>
          <strong>상태:</strong> {course.status}
        </p>
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
          <p>
            <strong>진행률:</strong> {course.progress}
          </p>
        </div>
      </div>

      <div className="flex gap-2 w-full justify-end mt-5">
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
        <Button onClick={() => alert("저장됨")}>저장하기</Button>
      </div>
    </Modal>
  );
}
