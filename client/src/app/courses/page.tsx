"use client";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import SearchBar from "@/components/SearchBar";
import CoursesTable from "@/components/courses/CoursesTable";
import SelectOption from "@/components/SelectOption";
import { CourseInfoModal } from "@/components/courses/CourseInfoModal";
import { StudentListModal } from "@/components/courses/StudentListModal";

const lectureOptions = ["전체", "진행중", "예정", "종료"];

interface Courses {
  id: number;
  title: string;
  instructor: string;
  studentCount: number;
  openDate: string;
  status: string;
  progress: string;
}

const lecturesData: Courses[] = [
  {
    id: 1,
    title: "React 입문",
    instructor: "김민수",
    studentCount: 120,
    openDate: "2023-01-10",
    status: "진행중",
    progress: "75%",
  },
  {
    id: 2,
    title: "TypeScript 완전정복",
    instructor: "박지현",
    studentCount: 85,
    openDate: "2023-02-05",
    status: "종료",
    progress: "100%",
  },
  {
    id: 3,
    title: "Next.js 실전 프로젝트",
    instructor: "이수연",
    studentCount: 60,
    openDate: "2023-03-15",
    status: "진행중",
    progress: "40%",
  },
  {
    id: 4,
    title: "GraphQL 기초부터 실습까지",
    instructor: "정하늘",
    studentCount: 45,
    openDate: "2023-04-01",
    status: "종료",
    progress: "100%",
  },
  {
    id: 5,
    title: "Docker 완전 이해",
    instructor: "한소희",
    studentCount: 75,
    openDate: "2023-04-20",
    status: "진행중",
    progress: "60%",
  },
  {
    id: 6,
    title: "AWS 클라우드 입문",
    instructor: "오지훈",
    studentCount: 110,
    openDate: "2023-05-10",
    status: "예정",
    progress: "0%",
  },
  {
    id: 7,
    title: "JavaScript 심화",
    instructor: "최유리",
    studentCount: 95,
    openDate: "2023-05-25",
    status: "종료",
    progress: "100%",
  },
  {
    id: 8,
    title: "Python 데이터 분석",
    instructor: "이정민",
    studentCount: 130,
    openDate: "2023-06-05",
    status: "진행중",
    progress: "85%",
  },
  {
    id: 9,
    title: "머신러닝 기초",
    instructor: "홍지은",
    studentCount: 80,
    openDate: "2023-06-20",
    status: "예정",
    progress: "0%",
  },
  {
    id: 10,
    title: "Deep Learning 입문",
    instructor: "장하늘",
    studentCount: 70,
    openDate: "2023-07-10",
    status: "종료",
    progress: "100%",
  },
  {
    id: 11,
    title: "Node.js 마스터",
    instructor: "한지우",
    studentCount: 65,
    openDate: "2023-07-25",
    status: "진행중",
    progress: "30%",
  },
  {
    id: 12,
    title: "데이터베이스 설계",
    instructor: "김도윤",
    studentCount: 90,
    openDate: "2023-08-05",
    status: "예정",
    progress: "0%",
  },
  {
    id: 13,
    title: "React Native 앱 개발",
    instructor: "윤세아",
    studentCount: 55,
    openDate: "2023-08-20",
    status: "진행중",
    progress: "50%",
  },
  {
    id: 14,
    title: "Kubernetes 실무",
    instructor: "박민재",
    studentCount: 40,
    openDate: "2023-09-01",
    status: "종료",
    progress: "100%",
  },
  {
    id: 15,
    title: "CSS 애니메이션",
    instructor: "서가은",
    studentCount: 100,
    openDate: "2023-09-15",
    status: "예정",
    progress: "0%",
  },
  {
    id: 16,
    title: "웹 접근성 완전정복",
    instructor: "정유빈",
    studentCount: 85,
    openDate: "2023-10-01",
    status: "진행중",
    progress: "20%",
  },
  {
    id: 17,
    title: "프론트엔드 성능 최적화",
    instructor: "강서준",
    studentCount: 120,
    openDate: "2023-10-20",
    status: "종료",
    progress: "100%",
  },
  {
    id: 18,
    title: "백엔드 API 개발",
    instructor: "이서현",
    studentCount: 110,
    openDate: "2023-11-05",
    status: "예정",
    progress: "0%",
  },
  {
    id: 19,
    title: "테스트 자동화",
    instructor: "최시우",
    studentCount: 75,
    openDate: "2023-11-20",
    status: "진행중",
    progress: "65%",
  },
  {
    id: 20,
    title: "DevOps 기초",
    instructor: "문지아",
    studentCount: 60,
    openDate: "2023-12-01",
    status: "예정",
    progress: "0%",
  },
];

interface Student {
  id: number;
  name: string;
  email: string;
}

// 강의 id별 수강생 목록
const courseStudentsMap: Record<number, Student[]> = {
  1: [
    { id: 1, name: "김철수", email: "kim@classboard.com" },
    { id: 2, name: "이영희", email: "lee@classboard.com" },
  ],
  2: [{ id: 3, name: "박민수", email: "park@classboard.com" }],
};

export default function CoursesPage() {
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Courses | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentList, setStudentList] = useState<Student[]>([]);

  const handleCourseClick = (course: Courses) => {
    setIsCourseModalOpen(true);
    setSelectedCourse(course);
  };

  const handleShowStudents = () => {
    if (!selectedCourse) return;
    const students = courseStudentsMap[selectedCourse.id] || [];
    setStudentList(students);
    setIsStudentModalOpen(true);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Header>{SIDEBAR_LABELS.COURSES}</Header>
          <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6">
            <div className="flex gap-2">
              <SearchBar placeholder="강의명 입력" />
              <SelectOption options={lectureOptions} defaultValue="전체" />
            </div>
            <CoursesTable data={lecturesData} onRowClick={handleCourseClick} />
          </main>
        </div>
      </div>
      <CourseInfoModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        course={selectedCourse}
        onShowStudents={handleShowStudents}
      />

      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        students={studentList}
      />
    </>
  );
}
