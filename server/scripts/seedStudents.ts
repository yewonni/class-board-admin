import prisma from "../src/prismaClient";
import { Faker, ko, en } from "@faker-js/faker";

const faker = new Faker({ locale: ko });
const fakerEn = new Faker({ locale: en });

async function main() {
  console.log("수강생 시드 시작...");

  const students = [];

  for (let i = 1; i <= 120; i++) {
    const name = faker.person.fullName();
    const firstNameEn = fakerEn.person.firstName().toLowerCase();
    const email = `${firstNameEn}${i}@classboard.com`;

    students.push({
      name,
      email,
      joinDate: faker.date.between({
        from: new Date("2023-01-01"),
        to: new Date("2024-06-30"),
      }),
      isActive: faker.datatype.boolean(),
    });
  }

  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: students,
  });

  console.log("수강생 120명 시드 완료!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
