"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getLectures } from "@/api/courses/courses";

interface Lecture {
  id: number;
  title: string;
  instructor: string;
  openDate: string;
  status: string;
  studentCount: number;
}

export default function TopCoursesSection() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setError(false);
        const res = await getLectures();
        const filtered = res.data.data.filter(
          (lecture) => lecture.status === "진행중"
        );
        const sorted = filtered.sort((a, b) => b.studentCount - a.studentCount);
        setLectures(sorted.slice(0, 5));
      } catch {
        setError(true);
      }
    };

    fetchLectures();
  }, []);

  return (
    <section className="bg-white w-full rounded-md p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-4">인기 강의 TOP 5</h2>
      <div className="overflow-x-auto">
        {error ? (
          <div className="h-[140px] flex items-center justify-center text-error text-sm border rounded-md">
            인기 강의 데이터를 불러오는 데 실패했습니다.
          </div>
        ) : (
          <table className="min-w-full text-sm text-left text-gray-700 table-fixed">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="w-12 px-4 py-2 text-center">순위</th>
                <th className="w-1/3 px-4 py-2 text-center">강의명</th>
                <th className="w-20 px-4 py-2 text-center">강사</th>
                <th className="w-20 px-4 py-2 text-center">수강생 수</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture, index) => (
                <tr key={lecture.id} className="border-t">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td
                    className="px-4 py-2 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                    title={lecture.title}
                  >
                    {lecture.title}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {lecture.instructor}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {lecture.studentCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
