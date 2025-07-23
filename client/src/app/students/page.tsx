"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import { SearchBar } from "@/components/SearchBar";
import StudentsTable from "@/components/students/StudentsTable";
import SelectOption from "@/components/SelectOption";
import { StudentInfoModal } from "@/components/students/StudentInfoModal";
import { getStudents, getStudentById } from "@/api/students/students";
import { Student } from "@/types/students/students";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/Pagination";
import { useLoadingStore } from "@/store/useLoadingStore";

const studentOptions = ["전체", "활성화", "비활성화"];

export default function StudentsPage() {
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("전체");
  const [error, setError] = useState(false);
  const [studentModalError, setStudentModalError] = useState<string | null>(
    null
  );
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useLoadingStore((state) => state.isLoading);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 400);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  useEffect(() => {
    setPage(1);
  }, [filterStatus, debouncedSearchKeyword]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setError(false);
        const isActiveParam: boolean | undefined =
          filterStatus === "활성화"
            ? true
            : filterStatus === "비활성화"
            ? false
            : undefined;

        const response = await getStudents(
          page,
          limit,
          isActiveParam,
          debouncedSearchKeyword
        );
        setStudentsData(response.data.data);
        setTotalCount(response.data.pagination?.totalCount ?? 0);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(error, "수강생 데이터 불러오기 실패");
        }
        setError(true);
      }
    };

    fetchStudents();
  }, [filterStatus, debouncedSearchKeyword, page]);

  if (!accessToken) {
    return null;
  }

  const handleUpdateStudent = (
    updatedStudent: Partial<Student> & { id: number }
  ) => {
    setStudentsData((prev) =>
      prev.map((stu) =>
        stu.id === updatedStudent.id ? { ...stu, ...updatedStudent } : stu
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
    setStudentModalOpen(false);
    setSelectedStudent(null);
    setHasChanges(false);
  };

  const handleStudentClick = async (student: Student) => {
    try {
      setStudentModalError(null);
      const response = await getStudentById(student.id);
      setSelectedStudent(response.data);
      setStudentModalOpen(true);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("수강생 상세조회 실패", error);
      }
      setStudentModalError("수강생 상세정보를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <>
      <div className="flex min-h-screen">
        <SideBar />
        <div className="flex-1">
          <Header>{SIDEBAR_LABELS.STUDENTS}</Header>
          <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6">
            <div className="flex gap-2">
              <SearchBar
                placeholder="이름, 이메일 입력"
                value={searchKeyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchKeyword(e.target.value)
                }
              />

              <SelectOption
                options={studentOptions}
                defaultValue="전체"
                onChange={(selected) => setFilterStatus(selected)}
              />
            </div>
            {!error && !isLoading && (
              <StudentsTable
                data={studentsData ?? []}
                onRowClick={handleStudentClick}
              />
            )}

            {studentModalError && (
              <p className="text-error text-sm mt-2">{studentModalError}</p>
            )}
            {error && !isLoading && (
              <p className="text-error text-sm mt-2">
                수강생 목록을 불러오는 중 오류가 발생했습니다.
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

      <StudentInfoModal
        isOpen={isStudentModalOpen}
        onClose={handleModalClose}
        student={selectedStudent}
        onStudentUpdated={(updated) => {
          handleUpdateStudent(updated);
          setStudentModalOpen(false);
          setHasChanges(false);
        }}
        onStatusChange={(changed) => setHasChanges(changed)}
      />
    </>
  );
}
