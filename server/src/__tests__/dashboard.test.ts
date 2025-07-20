import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD!;

describe("대시보드 API", () => {
  let accessToken: string;
  let createdDashboardLectures: { id: number; title: string }[] = [];

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
    await prisma.admin.upsert({
      where: { email: TEST_EMAIL },
      update: { password: hashedPassword },
      create: {
        email: TEST_EMAIL,
        password: hashedPassword,
      },
    });

    // 로그인 요청으로 토큰 확보
    const res = await request(app).post("/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    accessToken = res.body.accessToken;

    // 테스트용 강의 2개 생성
    const dashboardLecture1 = await prisma.lecture.create({
      data: {
        title: "React 입문",
        instructor: "홍길동",
        openDate: new Date("2024-01-01"),
        status: "진행중",
      },
    });

    const dashboardLecture2 = await prisma.lecture.create({
      data: {
        title: "Node.js 완전정복",
        instructor: "김개발",
        openDate: new Date("2024-02-01"),
        status: "예정",
      },
    });

    createdDashboardLectures = [dashboardLecture1, dashboardLecture2];

    // 테스트용 수강생 2명 + 수강 등록
    const dashboardStudent1 = await prisma.user.create({
      data: {
        name: "학생1",
        email: "student1@dashboard_test.com",
        isActive: true,
        joinDate: new Date("2024-03-15"),
      },
    });

    const dashboardStudent2 = await prisma.user.create({
      data: {
        name: "학생2",
        email: "student2@dashboard_test.com",
        isActive: true,
        joinDate: new Date("2024-03-20"),
      },
    });

    await prisma.enrollment.createMany({
      data: [
        {
          userId: dashboardStudent1.id,
          lectureId: createdDashboardLectures[0].id,
          enrollDate: new Date("2024-04-01"),
          progress: 80,
        },
        {
          userId: dashboardStudent2.id,
          lectureId: createdDashboardLectures[0].id,
          enrollDate: new Date("2024-04-01"),
          progress: 60,
        },
        {
          userId: dashboardStudent2.id,
          lectureId: createdDashboardLectures[1].id,
          enrollDate: new Date("2024-04-02"),
          progress: 90,
        },
      ],
    });
  });

  afterAll(async () => {
    // 테스트 데이터 정리
    await prisma.enrollment.deleteMany({
      where: {
        user: {
          email: {
            contains: "@dashboard_test.com",
          },
        },
      },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "@dashboard_test.com" } },
    });
    await prisma.lecture.deleteMany({
      where: {
        id: { in: createdDashboardLectures.map((lec) => lec.id) },
      },
    });
    await prisma.$disconnect();
  });

  it("월별 신규 수강생 수 조회", async () => {
    const res = await request(app)
      .get("/dashboard/students/monthly")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const hasMarch = res.body.some((item: { month: string }) =>
      item.month.includes("2024-03")
    );
    expect(hasMarch).toBe(true);
  });

  it("강의별 평균 진도율 조회", async () => {
    const res = await request(app)
      .get("/dashboard/progress/course")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("lectureId");
    expect(res.body[0]).toHaveProperty("lectureTitle");
    expect(res.body[0]).toHaveProperty("avgProgress");
  });
});
