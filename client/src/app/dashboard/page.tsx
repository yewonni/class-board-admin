"use client";
import React from "react";
import { useAuthStore } from "@/store/useAuthStore";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import OverviewSection from "@/components/dashboard/OverviewSection";
import NewStudentsByMonthSection from "@/components/dashboard/NewStudentsByMonthSection";
import ProgressionRateByCourseSection from "@/components/dashboard/ProgressionRateByCourseSection";
import TopCoursesSection from "@/components/dashboard/TopCoursesSection";
import RecentAlertsSection from "@/components/dashboard/RecentAlertsSection";

export default function DashboardPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!accessToken) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Header>{SIDEBAR_LABELS.DASHBOARD}</Header>
        <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-6">
          <OverviewSection />
          <div className="flex gap-6">
            <NewStudentsByMonthSection />
            <ProgressionRateByCourseSection />
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
