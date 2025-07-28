import axiosInstance from "../axiosInstance";

interface LecturesResponse {
  data: {
    id: number;
    title: string;
    instructor: string;
    openDate: string;
    status: string;
    studentCount: number;
  }[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
  };
  totalLecturesCount: number;
}

export const getLectures = (
  page = 0,
  limit = 20,
  status?: string,
  search?: string
) => {
  return axiosInstance.get<LecturesResponse>("api/courses", {
    params: {
      page,
      limit,
      status,
      search,
    },
  });
};

interface Courses {
  id: number;
  name: string;
  email: string;
}

interface CoursesDetail {
  id: number;
  title: string;
  instructor: string;
  openDate: string;
  status: string;
  studentCount: number;
  progress: string;
  students: Courses[];
}

export const getCourseById = (id: number) => {
  return axiosInstance.get<CoursesDetail>(`/api/courses/${id}`);
};

interface CourseStatusRequest {
  id: number;
  status: string;
}
export const editCourseStatus = ({ id, status }: CourseStatusRequest) => {
  return axiosInstance.put(`/api/courses/${id}`, { status });
};
