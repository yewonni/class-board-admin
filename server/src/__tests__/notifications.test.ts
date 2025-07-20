import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD!;

describe("알림 API", () => {
  let accessToken: string;
  let testNotificationId: number;

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

    const res = await request(app).post("/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    accessToken = res.body.accessToken;

    // 테스트용 알림 2개 생성
    await prisma.notification.createMany({
      data: [
        {
          message: "테스트알림1",
          category: "공지",
          date: new Date("2024-05-14"),
          isNew: false,
        },
        {
          message: "테스트알림2",
          category: "과제",
          date: new Date("2024-07-29"),
          isNew: true,
        },
      ],
    });

    const notification = await prisma.notification.findFirst({
      where: { message: "테스트알림1" },
    });
    testNotificationId = notification!.id;
  });

  // 테스트용 강의 정리
  afterAll(async () => {
    await prisma.notification.deleteMany({
      where: { message: { contains: "테스트알림" } },
    });
  });

  it("알림 목록 기본 조회", async () => {
    const res = await request(app)
      .get("/notifications")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("알림 필터 성공 (category=공지)", async () => {
    const res = await request(app)
      .get("/notifications?category=공지")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((n: any) => n.category === "공지")).toBe(true);
  });

  it("isNew 필터가 정상 동작하는지 확인", async () => {
    const res = await request(app)
      .get("/notifications?isNew=true")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((n: any) => n.isNew === true)).toBe(true);
  });

  it("알림 읽음 상태 변경 성공", async () => {
    const res = await request(app)
      .patch(`/notifications/${testNotificationId}/read`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isNew: false });

    expect(res.status).toBe(200);
    expect(res.body.data.isNew).toBe(false);
  });
});
