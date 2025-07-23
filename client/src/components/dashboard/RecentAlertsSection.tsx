"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  Notification,
} from "@/api/notifications/notifications";
import { showToast } from "@/utils/toast";
import { useLoadingStore } from "@/store/useLoadingStore";
import NotificationModal from "@/components/notifications/NotificationModal";
import { useNotificationStore } from "@/store/useNotificationStore";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" });
}

export default function RecentAlertsSection() {
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const loading = useLoadingStore((state) => state.isLoading);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setError(false);
        const res = await getNotifications(1, 5);
        setNotifications(res.data.data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.log(error, "최근 알림 불러오기 실패");
        }

        setError(true);
      }
    };
    fetchAlerts();
  }, [setNotifications]);

  const handleRead = async (note: Notification) => {
    try {
      if (note.isNew) {
        await markNotificationRead(note.id);
        markAsRead(note.id);
      }
      setSelectedNotification({ ...note, isNew: false });
      setIsModalOpen(true);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.log(error, "알림 확인 실패");
      }

      showToast("알림 확인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <section className="bg-white w-full rounded-md p-6 shadow-sm">
        <h2 className="font-bold text-lg mb-4">최근 알림 5건</h2>

        <ul className="max-h-[220px] overflow-y-auto space-y-3">
          {error && !loading ? (
            <li className="text-center text-red-500 py-10">
              최근 알림을 불러오는 데 실패했습니다.
            </li>
          ) : !loading && notifications.length === 0 ? (
            <li className="text-center text-gray-400 py-10">
              최근 알림이 없습니다.
            </li>
          ) : (
            notifications.map((note) => (
              <li
                key={note.id}
                onClick={() => handleRead(note)}
                className={`p-3 border rounded-md cursor-pointer relative ${
                  note.isNew
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(note.date)}
                  </span>
                  <div className="flex items-center gap-2">
                    {note.isNew && (
                      <span className="text-[10px] text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {note.category}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{note.message}</p>
              </li>
            ))
          )}
        </ul>
      </section>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNotification(null);
        }}
        data={selectedNotification}
      />
    </>
  );
}
