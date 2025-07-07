import axiosInstance from "../axiosInstance";

export interface Notification {
  id: number;
  message: string;
  category: string;
  date: string;
  isNew: boolean;
}

interface NotificationResponse {
  data: Notification[];
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
  };
}

export const getNotifications = (
  page = 1,
  limit = 30,
  category?: string,
  isNew?: boolean
) => {
  return axiosInstance.get<NotificationResponse>("/notifications", {
    params: {
      page,
      limit,
      category,
      isNew,
    },
  });
};

export const markNotificationRead = (id: number) => {
  return axiosInstance.patch(`/notifications/${id}/read`, { isNew: false });
};
