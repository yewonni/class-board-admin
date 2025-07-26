"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = __importDefault(require("../src/prismaClient"));
const faker_1 = require("@faker-js/faker");
const faker = new faker_1.Faker({ locale: faker_1.ko });
const fakerEn = new faker_1.Faker({ locale: faker_1.en });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield prismaClient_1.default.user.deleteMany();
        yield prismaClient_1.default.user.createMany({
            data: students,
        });
        console.log("수강생 120명 시드 완료!");
    });
}
main()
    .catch(console.error)
    .finally(() => prismaClient_1.default.$disconnect());
