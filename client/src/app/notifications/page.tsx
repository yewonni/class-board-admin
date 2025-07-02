"use client";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import Header from "@/components/Header";
import { SIDEBAR_LABELS } from "@/constants/constants";
import NotificationModal from "@/components/notifications/NotificationModal";

const categories = ["전체", "강의", "공지", "과제", "기타"];

const notifications = [
  {
    id: 1,
    message: "‘JavaScript 입문’ 강의가 업데이트되었습니다.",
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
    message:
      "‘React 실습 과제 2’ 제출 마감 3일 전입니다. 미제출자 3명 확인 필요.",
    category: "과제",
    date: "2025.06.24 09:20",
    isNew: true,
  },
  {
    id: 4,
    message: "새로운 ‘React 고급’ 강의가 등록되었습니다.",
    category: "강의",
    date: "2025.06.23 15:45",
    isNew: false,
  },
  {
    id: 5,
    message: "기타 안내: 설문조사 참여 요청 (응답률 12%)",
    category: "기타",
    date: "2025.06.22 13:00",
    isNew: true,
  },
  {
    id: 6,
    message: "공지사항: 여름방학 일정이 공지되었습니다.",
    category: "공지",
    date: "2025.06.21 08:30",
    isNew: false,
  },
  {
    id: 7,
    message: "‘Node.js 실습’ 강의 교안이 새로 업로드되었습니다.",
    category: "강의",
    date: "2025.06.20 17:10",
    isNew: true,
  },
  {
    id: 8,
    message: "‘프론트엔드 과제 1’ 점수가 공개되었습니다. 점수 확인 요망.",
    category: "과제",
    date: "2025.06.19 11:25",
    isNew: false,
  },
  {
    id: 9,
    message: "기타 알림: 커뮤니티 이벤트 응모자 리스트가 등록되었습니다.",
    category: "기타",
    date: "2025.06.18 14:50",
    isNew: false,
  },
  {
    id: 10,
    message: "‘CSS 마스터’ 강의가 업데이트되었습니다.",
    category: "강의",
    date: "2025.06.17 16:10",
    isNew: false,
  },
  {
    id: 11,
    message: "공지: 시스템 이용약관이 변경되었습니다.",
    category: "공지",
    date: "2025.06.16 09:00",
    isNew: true,
  },
  {
    id: 12,
    message: "‘기말 과제’ 제출률 82%. 미제출자 목록 확인 바랍니다.",
    category: "과제",
    date: "2025.06.15 18:20",
    isNew: false,
  },
];

export default function NotificationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedNotification, setSelectedNotification] = useState<
    null | (typeof notifications)[0]
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (item: (typeof notifications)[0]) => {
    setSelectedNotification(item);
    setIsModalOpen(true);
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
          <div className="flex gap-2 mb-4">
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
          </div>
          <h2 className="font-semibold">전체 ({notifications.length})</h2>
          <div className="bg-white shadow-sm rounded-md">
            {notifications.map((item) => (
              <article
                key={item.id}
                onClick={() => handleOpenModal(item)}
                className="p-6 flex flex-col gap-3 border-b border-b-gray-100 cursor-pointer hover:bg-gray-100 hover:shadow-sm active:scale-[0.98] transition-all duration-200 rounded-md"
              >
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <p className="hover:underline">{item.message}</p>
                    <p className="text-md text-gray-500">[{item.category}]</p>
                  </div>

                  <div
                    className={`px-2 py-0.5 text-xs  rounded-full flex justify-center items-center ${
                      item.isNew
                        ? "bg-primary text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    <span> {item.isNew ? "NEW" : "읽음"}</span>
                  </div>
                </div>

                <p className="text-[#6B7280] text-xs">{item.date}</p>
              </article>
            ))}
          </div>
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
