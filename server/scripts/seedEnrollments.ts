import prisma from "../src/prismaClient";
import { faker } from "@faker-js/faker";

async function seedEnrollments() {
  console.log("수강내역 시드 시작...");

  const users = await prisma.user.findMany();
  const lectures = await prisma.lecture.findMany();

  if (users.length === 0 || lectures.length === 0) {
    console.log("유저 또는 강의 데이터가 없습니다. 시드 전에 꼭 생성하세요");
    return;
  }

  const enrollments = [];

  for (const user of users) {
    const shuffledLectures = faker.helpers.shuffle(lectures);
    const lectureCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < lectureCount; i++) {
      const lecture = shuffledLectures[i];
      enrollments.push({
        userId: user.id,
        lectureId: lecture.id,
        enrollDate: faker.date.between({ from: user.joinDate, to: new Date() }),
        progress: faker.number.int({ min: 0, max: 100 }),
      });
    }
  }

  await prisma.enrollment.deleteMany();
  await prisma.enrollment.createMany({
    data: enrollments,
  });

  console.log(`수강 내역 ${enrollments.length}건 시드 완료!`);

  const count = await prisma.enrollment.count();
  console.log(`현재 enrollment 총 개수: ${count}`);
}

seedEnrollments()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
