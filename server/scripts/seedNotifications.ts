import prisma from "../src/prismaClient";
import { faker } from "@faker-js/faker";

async function seedNotifications() {
  console.log("알림 시드 시작...");

  const categories = ["강의", "공지", "과제", "기타"] as const;

  const lectureTitles = [
    "리액트 입문",
    "자바스크립트 마스터",
    "타입스크립트 완전정복",
    "Node.js 실전",
    "프론트엔드 프로젝트 실습",
  ];

  const notifications = [];

  for (let i = 0; i < 30; i++) {
    const category = faker.helpers.arrayElement(categories);
    let message = "";

    switch (category) {
      case "강의":
        message = `${faker.helpers.arrayElement(
          lectureTitles
        )} 강의가 새롭게 업데이트되었습니다.`;
        break;
      case "공지":
        message = `시스템 점검 안내: ${faker.date
          .soon({ days: 5 })
          .toISOString()
          .slice(0, 10)}에 예정되어 있습니다.`;

        break;
      case "과제":
        message = `${faker.helpers.arrayElement(
          lectureTitles
        )} 과제 제출 마감일이 ${faker.date
          .soon({ days: 7 })
          .toISOString()
          .slice(0, 10)}로 다가왔습니다.`;

        break;
      case "기타":
        message = `새로운 기능이 추가되었습니다! 자세한 내용은 공지사항을 확인해주세요.`;
        break;
    }

    notifications.push({
      message,
      category,
      date: faker.date.recent({ days: 30 }),
      isNew: faker.datatype.boolean(),
    });
  }

  await prisma.notification.deleteMany();
  await prisma.notification.createMany({
    data: notifications,
  });

  console.log("알림 30개 시드 완료!");
}

seedNotifications()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
