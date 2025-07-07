import axiosInstance from "../axiosInstance";

interface StudentsListResponse {
  data: {
    id: number;
    name: string;
    email: string;
    joinDate: string;
    isActive: boolean;
    recentLectures: {
      id: number;
      name: string;
      startDate: string;
      progress: string;
    }[];
  }[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
  };
  totalStudentsCount: number;
}

interface Lecture {
  id: number;
  name: string;
  startDate: string;
  progress: string;
}

interface StudentDetail {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  isActive: boolean;
  recentLectures: Lecture[];
}

interface GetStudentsParams {
  page: number;
  limit: number;
  isActive?: boolean;
  search?: string;
}

export const getStudents = (
  page = 1,
  limit = 20,
  isActive?: boolean,
  search?: string
) => {
  const params: GetStudentsParams = { page, limit };
  if (isActive !== undefined) params.isActive = isActive;
  if (search) params.search = search.trim();

  return axiosInstance.get<StudentsListResponse>("/students", { params });
};

export const getStudentById = (id: number) => {
  return axiosInstance.get<StudentDetail>(`/students/${id}`);
};

interface StudentStatusRequest {
  id: number;
  isActive: boolean;
}
export const editStudentStatus = ({ id, isActive }: StudentStatusRequest) => {
  return axiosInstance.put(`/students/${id}`, { isActive });
};
