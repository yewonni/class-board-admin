"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import { SearchBar } from "@/components/SearchBar";
import CoursesTable from "@/components/courses/CoursesTable";
import SelectOption from "@/components/SelectOption";
import { CourseInfoModal } from "@/components/courses/CourseInfoModal";
import { StudentListModal } from "@/components/courses/StudentListModal";
import { getLectures, getCourseById } from "@/api/courses/courses";
import {
  Courses,
  StudentByCourse,
  CoursesDetail,
} from "@/types/courses/courses";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination";
import { useLoadingStore } from "@/store/useLoadingStore";

const lectureOptions = ["전체", "진행중", "예정", "종료"];

export default function CoursesPage() {
  const router = useRouter();
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CoursesDetail | null>(
    null
  );
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentList, setStudentList] = useState<StudentByCourse[]>([]);
  const [lecturesData, setLecturesData] = useState<Courses[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("전체");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedKeyword = useDebounce(searchKeyword, 400);
  const [error, setError] = useState(false);
  const [courseModalError, setCourseModalError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    setPage(1);
  }, [filterStatus, debouncedKeyword]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setError(false);
        const statusParam = filterStatus === "전체" ? undefined : filterStatus;
        const response = await getLectures(
          page,
          limit,
          statusParam,
          debouncedKeyword
        );
        setLecturesData(response.data.data);
        setTotalCount(response.data.pagination?.totalCount ?? 0);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error, "강의 데이터 불러오기 실패");
        }
        setError(true);
      }
    };

    fetchLectures();
  }, [filterStatus, debouncedKeyword, page]);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return null;
  }

  const handleCourseClick = async (course: Courses) => {
    try {
      setCourseModalError(null);
      const response = await getCourseById(course.id);
      setSelectedCourse(response.data);
      setIsCourseModalOpen(true);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("강의 상세조회 실패", error);
      }
      setCourseModalError("강의 상세정보를 불러오는 데 실패했습니다.");
    }
  };

  const handleShowStudents = () => {
    if (!selectedCourse) return;
    setStudentList(selectedCourse.students);
    setIsStudentModalOpen(true);
  };

  const handleUpdateCourse = (
    updatedCourse: Partial<Courses> & { id: number }
  ) => {
    setLecturesData((prev) =>
      prev.map((course) =>
        course.id === updatedCourse.id
          ? { ...course, ...updatedCourse }
          : course
      )
    );
  };

  const handleModalClose = () => {
    if (hasChanges) {
      const confirmLeave = window.confirm(
        "저장하지 않은 변경사항이 있습니다. 정말 닫으시겠습니까?"
      );
      if (!confirmLeave) return;
    }
    setIsCourseModalOpen(false);
    setSelectedCourse(null);
    setHasChanges(false);
  };

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Header>{SIDEBAR_LABELS.COURSES}</Header>
          <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6">
            <div className="flex gap-2">
              <SearchBar
                placeholder="강의명 입력"
                value={searchKeyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchKeyword(e.target.value)
                }
              />
              <SelectOption
                options={lectureOptions}
                defaultValue="전체"
                onChange={(selected) => setFilterStatus(selected)}
              />
            </div>
            {!error && !isLoading && (
              <CoursesTable
                data={lecturesData}
                onRowClick={handleCourseClick}
              />
            )}
            {courseModalError && (
              <p className="text-error text-sm mt-2">{courseModalError}</p>
            )}
            {error && !isLoading && (
              <p className="text-error text-sm mt-2">
                강의 목록을 불러오는 중 오류가 발생했습니다.
              </p>
            )}
            {!isLoading && (
              <Pagination
                currentPage={page}
                totalCount={totalCount}
                limit={limit}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
          </main>
        </div>
      </div>

      <CourseInfoModal
        isOpen={isCourseModalOpen}
        onClose={handleModalClose}
        course={selectedCourse}
        onShowStudents={handleShowStudents}
        onCourseUpdated={(updated) => {
          handleUpdateCourse(updated);
          setIsCourseModalOpen(false);
          setHasChanges(false);
        }}
        onStatusChange={(changed) => setHasChanges(changed)}
      />

      <StudentListModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        students={studentList}
      />
    </>
  );
}
