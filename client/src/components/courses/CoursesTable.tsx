import React from "react";
import { Courses } from "@/types/courses/courses";

interface CoursesTablePropsType {
  data: Courses[];
  onRowClick: (course: Courses) => void;
}

export default function CoursesTable({
  data,
  onRowClick,
}: CoursesTablePropsType) {
  return (
    <table className="min-w-full border-collapse text-sm table-fixed">
      <thead>
        <tr className="bg-secondary border-b border-gray-300 text-gray-900">
          <th className="w-1/4 py-2 px-4 text-center">강의명</th>
          <th className="w-1/4 py-2 px-4 text-center">수강생 수</th>
          <th className="w-1/4 py-2 px-4 text-center">개설일</th>
          <th className="w-1/4 py-2 px-4 text-center">상태</th>
        </tr>
      </thead>
      <tbody className="text-gray-700">
        {data.map((lecture) => (
          <tr
            key={lecture.id}
            onClick={() => onRowClick(lecture)}
            className="odd:bg-white even:bg-[#F9FAFB] hover:bg-gray-200 cursor-pointer transition-all duration-200 active:scale-[0.98]"
          >
            <td className="w-1/4 py-2 px-4 text-center truncate whitespace-nowrap overflow-hidden max-w-0">
              {lecture.title}
            </td>
            <td className="w-1/4 py-2 px-4 text-center">
              {lecture.studentCount}
            </td>
            <td className="w-1/4 py-2 px-4 text-center">
              {lecture.openDate.split("T")[0]}
            </td>
            <td className="w-1/4 py-2 px-4 text-center">
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full font-medium
                    ${
                      lecture.status === "진행중"
                        ? "bg-green-100 text-green-800"
                        : lecture.status === "예정"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
              >
                {lecture.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
