"use client";
import Link from "next/link";
import { SIDEBAR_LABELS } from "@/constants/constants";
import { usePathname } from "next/navigation";

export const SIDEBAR_MENUS = [
  {
    label: SIDEBAR_LABELS.DASHBOARD,
    href: "/dashboard",
    icon: "/images/chart-icon.svg",
  },
  {
    label: SIDEBAR_LABELS.STUDENTS,
    href: "/students",
    icon: "/images/students-icon.svg",
  },
  {
    label: SIDEBAR_LABELS.COURSES,
    href: "/courses",
    icon: "/images/courses-icon.svg",
  },
  {
    label: SIDEBAR_LABELS.NOTIFICATIONS,
    href: "/notifications",
    icon: "/images/notifications-icon.svg",
  },
  {
    label: SIDEBAR_LABELS.SETTINGS,
    href: "/settings",
    icon: "/images/settings-icon.svg",
  },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebarBg w-[220px] min-h-screen px-4 py-6">
      <div className="flex justify-center mb-6 border-b border-b-[#686868] py-5">
        <Link href={"/dashboard"}>
          <img
            src="/images/logo.svg"
            alt="클래스보드 로고"
            className="h-12 object-contain cursor-pointer"
          />
        </Link>
      </div>

      <nav aria-label="사이드바 메뉴">
        <ul className="flex flex-col space-y-2 text-white font-semibold">
          {SIDEBAR_MENUS.map((menu) => {
            const isActive = pathname === menu.href;
            return (
              <li key={menu.href}>
                <Link
                  href={menu.href}
                  className={`flex items-center gap-3 py-2 px-3 rounded-md transition-colors
    ${isActive ? "bg-primaryActive" : "hover:bg-gray-700 "}`}
                >
                  <img src={menu.icon} alt="" className="w-5 h-5" />
                  <span>{menu.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
