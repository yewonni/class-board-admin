"use client";
import { useEffect, useRef } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    message: string;
    category: string;
    date: string;
    isNew: boolean;
  } | null;
}

export default function NotificationModal({
  isOpen,
  onClose,
  data,
}: NotificationModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen || !data) return null;

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "강의":
        return "bg-green-100 text-green-700";
      case "공지":
        return "bg-blue-100 text-blue-700";
      case "과제":
        return "bg-yellow-100 text-yellow-800";
      case "기타":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-[90%] max-w-md rounded-xl shadow-xl p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        <div
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${getCategoryBadgeColor(
            data.category
          )}`}
        >
          {data.category}
        </div>

        <p className="text-gray-800 text-base leading-relaxed mb-6 whitespace-pre-wrap">
          {data.message}
        </p>

        <div className="text-right text-xs text-gray-500">
          {`${data.date.split("T")[0]} ${
            data.date.split("T")[1].split(".")[0]
          }`}
        </div>
      </div>
    </div>
  );
}
