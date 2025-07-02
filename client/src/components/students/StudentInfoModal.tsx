import Modal from "../Modal";
import Button from "../Button";

interface Lecture {
  id: number;
  name: string;
  startDate: string;
  progress: string;
}

interface StudentInfo {
  name: string;
  email: string;
  joinDate: string;
  status: string;
  recentLectures: Lecture[];
}

interface StudentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentInfo | null;
}

export function StudentInfoModal({
  isOpen,
  onClose,
  student,
}: StudentInfoModalProps) {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="수강생 상세정보">
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>이름:</strong> {student.name}
        </p>
        <p>
          <strong>이메일:</strong> {student.email}
        </p>
        <p>
          <strong>가입일:</strong> {student.joinDate}
        </p>
        <p>
          <strong>상태:</strong> {student.status}
        </p>
      </div>
      <div className="mt-8">
        <p className="font-bold">최근 수강 내역</p>
        {student.recentLectures.length === 0 ? (
          <p className="text-sm text-gray-500 min-h-11 mt-3 text-center">
            수강 내역이 없습니다.
          </p>
        ) : (
          <table className="min-w-full border-collapse text-sm mt-2">
            <thead>
              <tr className="bg-gray-200 border-b border-b-gray-300 text-gray-900">
                <th className="w-1/4 py-1 px-4 text-center">강의명</th>
                <th className="w-1/4 py-1 px-4 text-center">수강 시작일</th>
                <th className="w-1/4 py-1 px-4 text-center">진행률</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {student.recentLectures.map((lecture) => (
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
          <Button onClick={() => alert("저장됨")}>저장하기</Button>
        </div>
      </div>
    </Modal>
  );
}
