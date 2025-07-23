import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RecentAlertsSection from "@/components/dashboard/RecentAlertsSection";
import { useLoadingStore } from "@/store/useLoadingStore";
import {
  useNotificationStore,
  Notification,
} from "@/store/useNotificationStore";
import {
  getNotifications,
  markNotificationRead,
} from "@/api/notifications/notifications";
import { showToast } from "@/utils/toast";
import { createAxiosResponse } from "@/utils/test/mockAxiosResponse";

interface MockModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Notification | null;
}

jest.mock("@/api/notifications/notifications");
jest.mock("@/utils/toast");
jest.mock("@/store/useLoadingStore");
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

const mockGetNotifications = getNotifications as jest.MockedFunction<
  typeof getNotifications
>;
const mockMarkNotificationRead = markNotificationRead as jest.MockedFunction<
  typeof markNotificationRead
>;
const mockShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockUseLoadingStore = useLoadingStore as jest.MockedFunction<
  typeof useLoadingStore
>;
const mockUseNotificationStore = useNotificationStore as jest.MockedFunction<
  typeof useNotificationStore
>;

const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "새로운 알림입니다.",
    category: "공지사항",
    date: "2024-01-15T09:00:00Z",
    isNew: true,
  },
  {
    id: 2,
    message: "읽은 알림입니다.",
    category: "시스템",
    date: "2024-01-14T10:30:00Z",
    isNew: false,
  },
];

describe("RecentAlertsSection", () => {
  const mockSetNotifications = jest.fn();
  const mockMarkAsRead = jest.fn();

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
    return render(<RecentAlertsSection />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoadingStore.mockReturnValue(false);
    setNotificationStore();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("API 호출 성공 시 알림 데이터를 가져오고, 상태에 반영한다.", async () => {
    mockGetNotifications.mockResolvedValue(
      createAxiosResponse({ data: mockNotifications })
    );

    renderComponent();

    await waitFor(() => {
      expect(mockGetNotifications).toHaveBeenCalledWith(1, 5);
      expect(mockSetNotifications).toHaveBeenCalledWith(mockNotifications);
    });
  });

  it("API 호출 실패 시 에러 메시지를 표시한다", async () => {
    mockGetNotifications.mockRejectedValue(new Error("fail"));
    setNotificationStore([]);

    renderComponent();

    expect(
      await screen.findByText("최근 알림을 불러오는 데 실패했습니다.")
    ).toBeInTheDocument();
  });

  it("알림이 없으면 빈 상태 메시지가 표시된다", () => {
    setNotificationStore([]);
    renderComponent();

    expect(screen.getByText("최근 알림이 없습니다.")).toBeInTheDocument();
  });

  it("새로운 알림 클릭 시 읽음 처리 API 호출 및 상태를 업데이트한다.", async () => {
    mockMarkNotificationRead.mockResolvedValue(createAxiosResponse({}));

    renderComponent();

    const newNotification = screen.getByText("새로운 알림입니다.");
    fireEvent.click(newNotification.closest("li")!);

    await waitFor(() => {
      expect(mockMarkNotificationRead).toHaveBeenCalledWith(1);
      expect(mockMarkAsRead).toHaveBeenCalledWith(1);
    });
  });

  it("이미 읽은 알림 클릭 시 읽음 처리 API를 호출하지 않는다", async () => {
    renderComponent();

    const readNotification = screen.getByText("읽은 알림입니다.");
    fireEvent.click(readNotification.closest("li")!);

    await waitFor(() => {
      expect(mockMarkNotificationRead).not.toHaveBeenCalled();
      expect(mockMarkAsRead).not.toHaveBeenCalled();
    });
  });

  it("읽음 처리 실패 시 토스트 메시지를 표시한다", async () => {
    mockMarkNotificationRead.mockRejectedValue(new Error("fail"));

    renderComponent();

    const newNotification = screen.getByText("새로운 알림입니다.");
    fireEvent.click(newNotification.closest("li")!);

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        "알림 확인에 실패했습니다. 다시 시도해주세요."
      );
    });
  });
});
