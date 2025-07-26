import React from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotificationModal from "@/components/notifications/NotificationModal";

const sampleNotification = {
  message: "테스트 알림입니다",
  category: "공지",
  date: "2025-07-26T10:00:00.000Z",
  isNew: false,
};

describe("NotificationModal", () => {
  it("모달이 열릴 때 알림 내용을 렌더링한다", () => {
    render(
      <NotificationModal
        isOpen={true}
        data={sampleNotification}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("테스트 알림입니다")).toBeInTheDocument();
    expect(screen.getByText("공지")).toBeInTheDocument();
    expect(screen.getByText("2025-07-26 10:00:00")).toBeInTheDocument();
  });

  it("닫기 버튼 클릭 시 onClose 콜백이 호출된다", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();

    render(
      <NotificationModal
        isOpen={true}
        data={sampleNotification}
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole("button", { name: "닫기" });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
