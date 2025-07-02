"use client";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import SearchBar from "@/components/SearchBar";
import StudentsTable from "@/components/students/StudentsTable";
import SelectOption from "@/components/SelectOption";
import { StudentInfoModal } from "@/components/students/StudentInfoModal";

const studentOptions = ["전체", "활성화", "비활성화"];

const studentsData = [
  {
    id: 1,
    name: "김철수",
    email: "example1@classboard.com",
    joinDate: "2023-01-01",
    status: "활성화",
    recentLectures: [
      { id: 1, name: "React 기초", startDate: "2024-06-01", progress: "90%" },
      {
        id: 2,
        name: "Next.js 프로젝트",
        startDate: "2024-05-15",
        progress: "60%",
      },
    ],
  },
  {
    id: 2,
    name: "홍길동",
    email: "hong2@classboard.com",
    joinDate: "2023-02-15",
    status: "비활성화",
    recentLectures: [
      {
        id: 1,
        name: "JavaScript 고급",
        startDate: "2024-03-01",
        progress: "100%",
      },
    ],
  },
  {
    id: 3,
    name: "이영희",
    email: "lee3@classboard.com",
    joinDate: "2023-03-10",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 4,
    name: "박민수",
    email: "park4@classboard.com",
    joinDate: "2023-04-05",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 5,
    name: "최수진",
    email: "choi5@classboard.com",
    joinDate: "2023-05-20",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 6,
    name: "정다은",
    email: "jung6@classboard.com",
    joinDate: "2023-06-12",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 7,
    name: "한지훈",
    email: "han7@classboard.com",
    joinDate: "2023-07-01",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 8,
    name: "오민재",
    email: "oh8@classboard.com",
    joinDate: "2023-07-25",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 9,
    name: "김나연",
    email: "kim9@classboard.com",
    joinDate: "2023-08-15",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 10,
    name: "서지훈",
    email: "seo10@classboard.com",
    joinDate: "2023-09-05",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 11,
    name: "이수현",
    email: "lee11@classboard.com",
    joinDate: "2023-09-20",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 12,
    name: "김민정",
    email: "kim12@classboard.com",
    joinDate: "2023-10-01",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 13,
    name: "박지훈",
    email: "park13@classboard.com",
    joinDate: "2023-10-15",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 14,
    name: "최유리",
    email: "choi14@classboard.com",
    joinDate: "2023-11-05",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 15,
    name: "정하늘",
    email: "jung15@classboard.com",
    joinDate: "2023-11-20",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 16,
    name: "한소희",
    email: "han16@classboard.com",
    joinDate: "2023-12-01",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 17,
    name: "오세훈",
    email: "oh17@classboard.com",
    joinDate: "2023-12-10",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 18,
    name: "김지아",
    email: "kim18@classboard.com",
    joinDate: "2023-12-20",
    status: "활성화",
    recentLectures: [],
  },
  {
    id: 19,
    name: "서민재",
    email: "seo19@classboard.com",
    joinDate: "2024-01-05",
    status: "비활성화",
    recentLectures: [],
  },
  {
    id: 20,
    name: "이승현",
    email: "lee20@classboard.com",
    joinDate: "2024-01-15",
    status: "활성화",
    recentLectures: [],
  },
];

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

export default function StudentsPage() {
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setStudentModalOpen(true);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Header>{SIDEBAR_LABELS.STUDENTS}</Header>
          <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6">
            <div className="flex gap-2">
              <SearchBar placeholder="이름, 이메일 입력" />
              <SelectOption options={studentOptions} defaultValue="전체" />
            </div>
            <StudentsTable
              data={studentsData}
              onRowClick={handleStudentClick}
            />
          </main>
        </div>
      </div>

      <StudentInfoModal
        isOpen={isStudentModalOpen}
        onClose={() => setStudentModalOpen(false)}
        student={selectedStudent}
      />
    </>
  );
}
