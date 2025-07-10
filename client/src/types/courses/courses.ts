export interface Courses {
  id: number;
  title: string;
  instructor: string;
  openDate: string;
  status: string;
  studentCount: number;
}

export interface StudentByCourse {
  id: number;
  name: string;
  email: string;
}

export interface CoursesDetail {
  id: number;
  title: string;
  instructor: string;
  openDate: string;
  status: string;
  studentCount: number;
  progress: string;
  students: StudentByCourse[];
}
