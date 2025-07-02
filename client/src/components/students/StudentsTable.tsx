interface Lecture {
  id: number;
  name: string;
  startDate: string;
  progress: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: string;
  recentLectures: Lecture[];
}

interface StudentsTableProps {
  data: Student[];
  onRowClick: (student: Student) => void;
}

export default function StudentsTable({
  data,
  onRowClick,
}: StudentsTableProps) {
  return (
    <table className="min-w-full border-collapse text-sm">
      <thead>
        <tr className="bg-secondary border-b border-gray-300 text-gray-900">
          <th className="w-1/4 py-2 px-4 text-center">이름</th>
          <th className="w-1/4 py-2 px-4 text-center">이메일</th>
          <th className="w-1/4 py-2 px-4 text-center">가입일</th>
          <th className="w-1/4 py-2 px-4 text-center">상태</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {data.map((student) => (
          <tr
            key={student.id}
            onClick={() => onRowClick(student)}
            className="odd:bg-white even:bg-[#F9FAFB] hover:bg-gray-200 cursor-pointer transition-all duration-200 active:scale-[0.98]"
          >
            <td className="py-2 px-4 text-center">{student.name}</td>
            <td className="py-2 px-4 text-center truncate">{student.email}</td>
            <td className="py-2 px-4 text-center">{student.joinDate}</td>
            <td className="py-2 px-4 text-center">
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                  student.status === "활성화"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {student.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
