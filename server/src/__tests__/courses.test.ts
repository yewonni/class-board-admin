import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD!;

describe("강의 API", () => {
  let accessToken: string;
  let testLectureId: number;

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

    // 테스트용 강의 2개 생성
    await prisma.lecture.createMany({
      data: [
        {
          title: "테스트강의1",
          instructor: "테스트강사1",
          openDate: new Date("2024-02-14"),
          status: "예정",
        },
        {
          title: "테스트강의2",
          instructor: "테스트강사2",
          openDate: new Date("2024-09-24"),
          status: "진행중",
        },
      ],
    });

    const lecture = await prisma.lecture.findFirst({
      where: { title: "테스트강의1" },
    });

    testLectureId = lecture!.id;
  });

  //테스트용 강의 정리
  afterAll(async () => {
    await prisma.lecture.deleteMany({
      where: { title: { contains: "테스트강의" } },
    });
  });

  it("강의 목록 기본 조회 성공", async () => {
    const res = await request(app)
      .get("/courses")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("pagination");
  });

  it("강의명 검색 ", async () => {
    const res = await request(app)
      .get("/courses?search=테스트강의1")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(
      res.body.data.every((l: any) => l.title.includes("테스트강의1"))
    ).toBe(true);
  });

  it("강의 목록 상태 필터 적용", async () => {
    const res = await request(app)
      .get("/courses?status=예정")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((s: any) => s.status === "예정")).toBe(true);
  });

  it("강의 상세 조회 성공", async () => {
    const res = await request(app)
      .get(`/courses/${testLectureId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", testLectureId);
  });

  it("강의 status 수정 성공", async () => {
    const res = await request(app)
      .put(`/courses/${testLectureId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ status: "진행중" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("진행중");
  });
});
