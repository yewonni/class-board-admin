import request from "supertest";
import app from "../app";
import prisma from "../prismaClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD!;

describe("수강생 API", () => {
  let accessToken: string;
  let testStudentId: number;

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

    // 테스트용 수강생 2명 생성
    await prisma.user.createMany({
      data: [
        {
          name: "학생1",
          email: "student1@students_test.com",
          isActive: true,
          joinDate: new Date("2024-05-13"),
        },
        {
          name: "학생2",
          email: "student2@students_test.com",
          isActive: true,
          joinDate: new Date("2024-09-24"),
        },
      ],
    });

    const student = await prisma.user.findFirst({
      where: { email: "student1@students_test.com" },
    });

    testStudentId = student!.id;
  });

  afterAll(async () => {
    // 테스트용 수강생 정리
    await prisma.user.deleteMany({
      where: { email: { contains: "@students_test.com" } },
    });
  });

  it("수강생 목록 기본 조회 성공", async () => {
    const res = await request(app)
      .get("/students")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty("pagination");
    expect(res.body).toHaveProperty("totalStudentsCount");
  });

  it("수강생 목록 isActive 필터 적용", async () => {
    const res = await request(app)
      .get("/students?isActive=true")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((s: any) => s.isActive === true)).toBe(true);
  });

  it("수강생 검색", async () => {
    const res = await request(app)
      .get("/students?search=student1")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(
      res.body.data.some(
        (s: any) => s.name.includes("student1") || s.email.includes("student1")
      )
    ).toBe(true);
  });

  it("수강생 상세 조회 성공", async () => {
    const res = await request(app)
      .get(`/students/${testStudentId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", testStudentId);
    expect(res.body).toHaveProperty("recentLectures");
  });

  it("수강생 상세 조회 - 없는 ID 404", async () => {
    const res = await request(app)
      .get("/students/999999999")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });

  it("수강생 수정 isActive 성공", async () => {
    const res = await request(app)
      .put(`/students/${testStudentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isActive: false });

    expect(res.status).toBe(200);
    expect(res.body.isActive).toBe(false);
  });

  it("수강생 수정 - isActive 잘못된 타입 400", async () => {
    const res = await request(app)
      .put(`/students/${testStudentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ isActive: "not_boolean" });

    expect(res.status).toBe(400);
  });
});
