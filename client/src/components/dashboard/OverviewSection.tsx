"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getStudents } from "@/api/students/students";
import { getLectures } from "@/api/courses/courses";
import { getNotifications } from "@/api/notifications/notifications";
import { getAverageProgress } from "@/api/dashboard/dashboard";
import { useLoadingStore } from "@/store/useLoadingStore";

export default function OverviewSection() {
  const [allStudentsCount, setAllStudentsCount] = useState(0);
  const [allCoursesCount, setAllCoursesCount] = useState(0);
  const [averageProgress, setAverageProgress] = useState(0);
  const [unreadNotiCount, setUnreadNotiCount] = useState(0);
  const [studentsError, setStudentsError] = useState(false);
  const [coursesError, setCoursesError] = useState(false);
  const [progressError, setProgressError] = useState(false);
  const [notiError, setNotiError] = useState(false);
  const isLoading = useLoadingStore((state) => state.isLoading);

  const fetchStudentsCount = async () => {
    try {
      setStudentsError(false);
      const response = await getStudents();
      setAllStudentsCount(response.data.totalStudentsCount);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error, "전체 수강생 수 불러오기 실패");
      }
      setStudentsError(true);
    }
  };

  const fetchCoursesCount = async () => {
    try {
      setCoursesError(false);
      const response = await getLectures();
      setAllCoursesCount(response.data.totalLecturesCount);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error, "강의 수 불러오기 실패");
      }
      setCoursesError(true);
    }
  };

  const fetchAverageProgress = async () => {
    try {
      setProgressError(false);
      const response = await getAverageProgress();
      setAverageProgress(response.data.averageProgress);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error, "진도율 불러오기 실패");
      }
      setProgressError(true);
    }
  };

  const fetchUnreadNotiCount = async () => {
    try {
      setNotiError(false);
      const response = await getNotifications(1, 1, undefined, true);
      setUnreadNotiCount(response.data.pagination?.totalCount || 0);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error, "미확인 알림 수 불러오기 실패");
      }
      setNotiError(true);
    }
  };

  useEffect(() => {
    fetchStudentsCount();
    fetchCoursesCount();
    fetchAverageProgress();
    fetchUnreadNotiCount();
  }, []);

  return (
    <section className="bg-white w-full rounded-md p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-2">현황 요약</h2>
      <div className="flex justify-around gap-6">
        {/* 전체 수강생 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/all-students.svg'), linear-gradient(90deg, #7A5ADD 0%, #B8B8FF 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">전체 수강생</h3>
          {studentsError && !isLoading ? (
            <p className="text-error">
              수강생 데이터를 불러오는 데 실패했습니다.
            </p>
          ) : (
            <p>{allStudentsCount}명</p>
          )}
        </article>

        {/* 총 강의 수 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/all-courses.svg'), linear-gradient(90deg, #5694B1 0%, #CBF3F0 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">총 강의 수</h3>
          {coursesError && !isLoading ? (
            <p className="text-error text-sm mt-2">
              강의 수 데이터를 불러오는 데 실패했습니다.
            </p>
          ) : (
            <p className="text-2xl font-bold">{allCoursesCount}개</p>
          )}
        </article>

        {/* 평균 수강 진도율*/}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/today-attendance.svg'), linear-gradient(90deg, #E36B94 0%, #FDCFE8 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">평균 수강 진도율</h3>
          {progressError && !isLoading ? (
            <p className="text-error text-sm mt-2">
              진도율 데이터를 불러오는 데 실패했습니다.
            </p>
          ) : (
            <p className="text-2xl font-bold">{averageProgress}%</p>
          )}
        </article>

        {/* 미확인 알림 수 */}
        <article
          className="rounded-lg p-6 text-white flex-1"
          style={{
            backgroundImage:
              "url('/images/unconfirmed-noti.svg'), linear-gradient(90deg, #EE6565 0%, #FFD6A5 100%)",
            backgroundRepeat: "no-repeat, no-repeat",
            backgroundPosition: "calc(100% - 1rem) center, center",
            backgroundSize: "55px, 100% 100%",
          }}
        >
          <h3 className="mb-2 font-semibold">미확인 알림 수</h3>
          {notiError && !isLoading ? (
            <p className="text-error text-sm mt-2">
              알림 수 데이터를 불러오는 데 실패했습니다.
            </p>
          ) : (
            <p className="text-2xl font-bold">{unreadNotiCount}건</p>
          )}
        </article>
      </div>
    </section>
  );
}
