"use client";

import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/api/auth/logout";

interface HeaderProps {
  children?: ReactNode;
}

interface Notification {
  id: number;
  message: string;
  category: string;
  date: string;
  isNew: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    message:
      "‘JavaScript 입문’ 강의가 업데이트되었습니다. 자세한 내용은 강의 페이지를 참고해 주세요.",
    category: "강의",
    date: "2025.06.26 16:34",
    isNew: true,
  },
  {
    id: 2,
    message: "시스템 공지: 서버 점검 안내 예정입니다.",
    category: "공지",
    date: "2025.06.25 10:00",
    isNew: false,
  },
  {
    id: 3,
    message: "‘React 실습 과제 2’ 제출 마감 3일 전입니다.",
    category: "과제",
    date: "2025.06.24 09:20",
    isNew: true,
  },
];

export default function Header({ children }: HeaderProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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

  const handleNotificationToggle = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  const handleGoToNotificationCenter = () => {
    router.push("/notifications");
    setIsNotificationOpen(false);
  };

  return (
    <header className="flex justify-between items-center p-4 px-6 shadow-md z-10 relative bg-white">
      <h1 className="text-xl font-bold">{children}</h1>
      <div ref={wrapperRef} className="relative">
        <div className="flex items-center gap-2">
          <img
            src="/images/noti-on.svg"
            alt="최근 알림 확인하기"
            className="mr-4 cursor-pointer transition-transform duration-150 ease-in-out
             hover:brightness-110 active:brightness-90
             hover:scale-105 active:scale-95 "
            onClick={handleNotificationToggle}
          />
          <p className="font-semibold text-lg">관리자님</p>
          <img
            src="/images/chevron-down.svg"
            alt="로그아웃 메뉴 열기"
            className="w-4 cursor-pointer"
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
                    onClick={() => {
                      alert(item.message);
                      setIsNotificationOpen(false);
                    }}
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
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                    {item.isNew && (
                      <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs bg-primary text-white rounded-full whitespace-nowrap">
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
  );
}
