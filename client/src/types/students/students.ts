export interface Lecture {
  id: number;
  name: string;
  startDate: string;
  progress: string;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  isActive: boolean;
  recentLectures: Lecture[];
}
