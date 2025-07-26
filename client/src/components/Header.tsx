"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth/logout";
import {
  getNotifications,
  markNotificationRead,
  Notification,
} from "@/api/notifications/notifications";
import NotificationModal from "@/components/notifications/NotificationModal";
import { useNotificationStore } from "@/store/useNotificationStore";

interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const handleLogoutMenuOpen = () => {
    setIsLogoutMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setIsLogoutMenuOpen(false);
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  const handleNotificationToggle = async () => {
    setIsNotificationOpen((prev) => !prev);
    if (!isNotificationOpen) {
      try {
        const response = await getNotifications(1, 3);
        setNotifications(response.data.data);
      } catch (error) {
        console.error("알림 가져오기 실패", error);
      }
    }
  };

  const handleClickNotification = async (item: Notification) => {
    try {
      if (item.isNew) {
        await markNotificationRead(item.id);
        markAsRead(item.id);
      }
      setSelectedNotification({ ...item, isNew: false });
      setIsModalOpen(true);
      setIsNotificationOpen(false);
    } catch (error) {
      console.error("알림 읽음 처리 실패", error);
    }
  };

  const handleGoToNotificationCenter = () => {
    router.push("/notifications");
    setIsNotificationOpen(false);
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 px-6 shadow-md z-10 relative bg-white">
        <h1 className="text-xl font-bold">{children}</h1>
        <div ref={wrapperRef} className="relative">
          <div className="flex items-center gap-2">
            <img
              src="/images/noti-on.svg"
              alt="최근 알림 확인하기"
              className="w-7 h-8 mr-4 cursor-pointer transition-transform duration-150 ease-in-out
             hover:brightness-110 active:brightness-90
             hover:scale-105 active:scale-95 "
              onClick={handleNotificationToggle}
            />
            <p className="font-semibold text-lg">관리자님</p>
            <img
              src="/images/chevron-down.svg"
              alt="로그아웃 메뉴 열기"
              className="w-4 h-3 cursor-pointer"
              onClick={handleLogoutMenuOpen}
            />
            {isNotificationOpen && (
              <div className="absolute right-0 top-10 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-20">
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 && (
                    <p className="p-4 text-center text-gray-500 text-sm">
                      알림이 없습니다.
                    </p>
                  )}
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-start"
                      onClick={() => handleClickNotification(item)}
                    >
                      <div className="flex flex-col max-w-[90%] min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          title={item.message}
                        >
                          {item.message}{" "}
                          <span className="text-xs text-gray-400">
                            [{item.category}]
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {`${item.date.split("T")[0]} ${
                            item.date.split("T")[1].split(".")[0]
                          }`}
                        </p>
                      </div>
                      {item.isNew && (
                        <span className="text-[10px] text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleGoToNotificationCenter}
                  className="w-full text-center py-2 border-t border-gray-300 font-semibold hover:bg-primary-dark rounded-b-md text-accent transition-colors bg-gray-100 hover:bg-gray-200"
                >
                  알림센터로 이동
                </button>
              </div>
            )}
          </div>
          {isLogoutMenuOpen && (
            <div
              onClick={handleLogout}
              className="absolute flex gap-1 items-center bg-white p-2 border-2 border-primary right-0 top-10 font-bold text-sm rounded-md cursor-pointer hover:bg-gray-100"
            >
              <img src="/images/logout.svg" alt="" />
              <p>로그아웃</p>
            </div>
          )}
        </div>
      </header>
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
