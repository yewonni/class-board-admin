import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import NotificationsPage from "@/app/notifications/page";
import { useAuthStore, AuthState } from "@/store/useAuthStore";
import { SIDEBAR_LABELS } from "@/constants/constants";
import {
  getNotifications,
  markNotificationRead,
} from "@/api/notifications/notifications";
import { showToast } from "@/utils/toast";
import { useNotificationStore } from "@/store/useNotificationStore";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

interface MockModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    message: string;
  } | null;
}

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
  usePathname: jest.fn(() => "/notifications"),
}));

jest.mock("@/store/useAuthStore");
jest.mock("@/api/notifications/notifications");
jest.mock("@/utils/toast");
jest.mock("@/store/useNotificationStore");

jest.mock("@/components/notifications/NotificationModal", () => {
  return function MockNotificationModal({
    isOpen,
    onClose,
    data,
  }: MockModalProps) {
    return isOpen ? (
      <div data-testid="notification-modal">
        <button onClick={onClose}>Close Modal</button>
        <div>{data?.message}</div>
      </div>
    ) : null;
  };
});

const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;
const mockGetNotifications = getNotifications as jest.MockedFunction<
  typeof getNotifications
>;
const mockMarkNotificationRead = markNotificationRead as jest.MockedFunction<
  typeof markNotificationRead
>;
const mockShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockUseNotificationStore = useNotificationStore as jest.MockedFunction<
  typeof useNotificationStore
>;

const mockSetAccessToken = jest.fn();
const mockSetNotifications = jest.fn();
const mockMarkAsRead = jest.fn();

const mockNotifications = [
  {
    id: 1,
    message: "새로운 알림입니다.",
    category: "공지",
    date: "2025-07-26T10:00:00.000Z",
    isNew: true,
  },
  {
    id: 2,
    message: "읽은 알림입니다.",
    category: "과제",
    date: "2025-07-25T09:00:00.000Z",
    isNew: false,
  },
];

describe("NotificationsPage", () => {
  function setNotificationStore(notifications = mockNotifications) {
    mockUseNotificationStore.mockImplementation((selector) =>
      selector({
        notifications,
        setNotifications: mockSetNotifications,
        markAsRead: mockMarkAsRead,
      })
    );
  }

  function renderComponent() {
    return render(<NotificationsPage />);
  }

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: "valid-token",
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    mockUseNotificationStore.mockReset();
    mockGetNotifications.mockReset();
    mockMarkNotificationRead.mockReset();
    mockShowToast.mockReset();

    setNotificationStore();
  });

  it("토큰이 없으면 내용이 렌더링되지 않는다", () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        accessToken: null,
        setAccessToken: mockSetAccessToken,
        logout: jest.fn(),
      } as AuthState)
    );

    renderComponent();

    expect(
      screen.queryByRole("heading", { name: SIDEBAR_LABELS.NOTIFICATIONS })
    ).not.toBeInTheDocument();
  });

  it("토큰이 있으면 알림센터가 렌더링된다", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: SIDEBAR_LABELS.NOTIFICATIONS })
    ).toBeInTheDocument();
  });

  it("알림 목록 클릭 시 새로운 알림이면 읽음 처리 API 호출과 상태 업데이트가 된다", async () => {
    mockMarkNotificationRead.mockResolvedValue(createAxiosResponse({}));

    renderComponent();

    // isNew: true인 첫 번째 알림 클릭
    const newNotification = screen.getByText("새로운 알림입니다.");
    fireEvent.click(newNotification.closest("article")!);

    await waitFor(() => {
      expect(mockMarkNotificationRead).toHaveBeenCalledWith(1);
      expect(mockMarkAsRead).toHaveBeenCalledWith(1);
    });
  });

  it("읽은 알림 클릭 시 읽음 처리 API가 호출되지 않는다", async () => {
    renderComponent();

    const readNotification = screen.getByText("읽은 알림입니다.");
    fireEvent.click(readNotification.closest("article")!);

    await waitFor(() => {
      expect(mockMarkNotificationRead).not.toHaveBeenCalled();
      expect(mockMarkAsRead).not.toHaveBeenCalled();
    });
  });

  it("읽음 처리 실패 시 토스트 메시지를 보여준다", async () => {
    mockMarkNotificationRead.mockRejectedValue(new Error("fail"));

    renderComponent();

    const newNotification = screen.getByText("새로운 알림입니다.");
    fireEvent.click(newNotification.closest("article")!);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "알림 확인에 실패했습니다. 다시 시도해주세요."
      );
    });
  });
});
