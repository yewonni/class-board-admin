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
function seedEnrollments() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("수강내역 시드 시작...");
        const users = yield prismaClient_1.default.user.findMany();
        const lectures = yield prismaClient_1.default.lecture.findMany();
        if (users.length === 0 || lectures.length === 0) {
            console.log("유저 또는 강의 데이터가 없습니다. 시드 전에 꼭 생성하세요");
            return;
        }
        const enrollments = [];
        for (const user of users) {
            const shuffledLectures = faker_1.faker.helpers.shuffle(lectures);
            const lectureCount = faker_1.faker.number.int({ min: 1, max: 3 });
            for (let i = 0; i < lectureCount; i++) {
                const lecture = shuffledLectures[i];
                enrollments.push({
                    userId: user.id,
                    lectureId: lecture.id,
                    enrollDate: faker_1.faker.date.between({ from: user.joinDate, to: new Date() }),
                    progress: faker_1.faker.number.int({ min: 0, max: 100 }),
                });
            }
        }
        yield prismaClient_1.default.enrollment.deleteMany();
        yield prismaClient_1.default.enrollment.createMany({
            data: enrollments,
        });
        console.log(`수강 내역 ${enrollments.length}건 시드 완료!`);
        const count = yield prismaClient_1.default.enrollment.count();
        console.log(`현재 enrollment 총 개수: ${count}`);
    });
}
seedEnrollments()
    .catch(console.error)
    .finally(() => prismaClient_1.default.$disconnect());
//# sourceMappingURL=seedEnrollments.js.map