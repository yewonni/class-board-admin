"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import NotificationModal from "@/components/notifications/NotificationModal";
import {
  getNotifications,
  markNotificationRead,
} from "@/api/notifications/notifications";
import Pagination from "@/components/Pagination";
import { useLoadingStore } from "@/store/useLoadingStore";
import { useNotificationStore } from "@/store/useNotificationStore";

const categories = ["전체", "강의", "공지", "과제", "기타"];

interface Notification {
  id: number;
  message: string;
  category: string;
  date: string;
  isNew: boolean;
}

export default function NotificationsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isLoading = useLoadingStore((state) => state.isLoading);

  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 7;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError(false);
        const categoryParam =
          selectedCategory === "전체" ? undefined : selectedCategory;
        const response = await getNotifications(
          page,
          limit,
          categoryParam,
          showOnlyNew ? true : undefined
        );
        setNotifications(response.data.data);
        setTotalCount(response.data.pagination?.totalCount ?? 0);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(error, "알림 불러오기 실패");
        }
        setError(true);
      }
    };

    fetchNotifications();
  }, [selectedCategory, page, showOnlyNew, setNotifications]);

  if (!accessToken) {
    return null;
  }

  const handleOpenModal = async (item: Notification) => {
    setSelectedNotification(item);
    setIsModalOpen(true);

    if (item.isNew) {
      try {
        await markNotificationRead(item.id);
        markAsRead(item.id);
        setSelectedNotification({ ...item, isNew: false });
      } catch (error) {
        console.error("읽음 상태 변경 실패", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">
        <Header>{SIDEBAR_LABELS.NOTIFICATIONS}</Header>
        <main className="p-6 bg-mainBg min-h-screen flex flex-col gap-2">
          <div className="flex gap-2 mb-4 items-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full border text-sm transition-colors duration-150
          ${
            selectedCategory === category
              ? "bg-accent text-white border-accent"
              : "border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}
              >
                {category}
              </button>
            ))}

            <label className="flex items-center text-sm gap-1 ml-4">
              <input
                type="checkbox"
                checked={showOnlyNew}
                onChange={() => {
                  setShowOnlyNew((prev) => !prev);
                  setPage(1);
                }}
                className="accent-primary"
              />
              미확인 알림만
            </label>
          </div>

          <h2 className="font-semibold">
            {selectedCategory} ({totalCount})
          </h2>

          <div className="bg-white shadow-sm rounded-md">
            {error && !isLoading && (
              <p className="p-6 text-center text-error">
                알림 목록을 불러오는 데 실패했습니다.
              </p>
            )}

            {!error && !isLoading && notifications.length === 0 && (
              <p className="p-6 text-center text-gray-500">알림이 없습니다.</p>
            )}

            {!error && !isLoading && notifications.length > 0 && (
              <>
                {notifications.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => handleOpenModal(item)}
                    className="p-6 flex flex-col gap-3 border-b border-b-gray-100 cursor-pointer hover:bg-gray-100 hover:shadow-sm active:scale-[0.98] transition-all duration-200 rounded-md"
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <p className="hover:underline">{item.message}</p>
                        <p className="text-md text-gray-500">
                          [{item.category}]
                        </p>
                      </div>
                      <div
                        className={`px-2 py-0.5 text-xs rounded-full flex justify-center items-center ${
                          item.isNew
                            ? "bg-primary text-white"
                            : "bg-gray-300 text-gray-500"
                        }`}
                      >
                        <span>{item.isNew ? "NEW" : "읽음"}</span>
                      </div>
                    </div>
                    <p className="text-[#6B7280] text-xs">
                      {item.date.split("T")[0]}
                    </p>
                  </article>
                ))}
              </>
            )}
          </div>

          {!isLoading && (
            <Pagination
              currentPage={page}
              totalCount={totalCount}
              limit={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </main>
        <NotificationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          data={selectedNotification}
        />
      </div>
    </div>
  );
}
