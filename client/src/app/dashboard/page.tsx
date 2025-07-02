"use client";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import OverviewSection from "@/components/dashboard/OverviewSection";
import NewStudentsByMonthSection from "@/components/dashboard/NewStudentsByMonthSection";
import AttendanceRateByCourseSection from "@/components/dashboard/AttendanceRateByCourseSection";
import TopCoursesSection from "@/components/dashboard/TopCoursesSection";
import RecentAlertsSection from "@/components/dashboard/RecentAlertsSection";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Header>{SIDEBAR_LABELS.DASHBOARD}</Header>
        <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6">
          <OverviewSection />
          <div className="flex gap-6">
            <NewStudentsByMonthSection />
            <AttendanceRateByCourseSection />
          </div>
          <div className="flex gap-6">
            <TopCoursesSection />
            <RecentAlertsSection />
          </div>
        </main>
      </div>
    </div>
  );
}
