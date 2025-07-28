import axiosInstance from "../axiosInstance";

export const getAverageProgress = () => {
  return axiosInstance.get<{ averageProgress: number }>(
    "/api/dashboard/progress"
  );
};

export interface MonthlyStudentStat {
  month: string;
  count: number;
}

export const getMonthlyStudentStats = () => {
  return axiosInstance.get<MonthlyStudentStat[]>(
    "/api/dashboard/students/monthly"
  );
};

export interface CourseProgress {
  lectureId: number;
  lectureTitle: string;
  avgProgress: number;
}

export const getCourseAverageProgress = () => {
  return axiosInstance.get<CourseProgress[]>("/api/dashboard/progress/course");
};
