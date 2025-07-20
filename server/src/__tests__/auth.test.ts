import request from "supertest";
import app from "../app";
import bcrypt from "bcrypt";
import prisma from "../prismaClient";
import dotenv from "dotenv";

dotenv.config();

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL!;
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD!;

describe("로그인 API", () => {
  beforeAll(async () => {
    // 테스트용 계정이 없으면 생성, 있으면 비밀번호만 초기화
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);
    await prisma.admin.upsert({
      where: { email: TEST_EMAIL },
      update: { password: hashedPassword },
      create: {
        email: TEST_EMAIL,
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("로그인 성공 시 access token과 200을 반환한다.", async () => {
    const res = await request(app).post("/auth/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("비밀번호가 일치하지 않으면 401을 반환한다.", async () => {
    const res = await request(app).post("/auth/login").send({
      email: TEST_EMAIL,
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });
});
