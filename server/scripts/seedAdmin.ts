import prisma from "../src/prismaClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const plainPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !plainPassword) {
    throw new Error(
      "환경 변수 SEED_ADMIN_EMAIL 또는 SEED_ADMIN_PASSWORD가 설정되지 않았습니다."
    );
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // 이미 있는지 체크
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("이미 해당 이메일의 계정이 존재합니다.");
    return;
  }

  // 새 관리자 생성
  await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  console.log("관리자 계정이 생성되었습니다.");
}

seedAdmin()
  .catch((err) => console.error("시드 중 오류 발생:", err))
  .finally(() => prisma.$disconnect());
