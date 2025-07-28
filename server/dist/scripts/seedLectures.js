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
function seedLectures() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("강의 시드 시작...");
        const lectureTitles = [
            "리액트 입문",
            "자바스크립트 마스터",
            "HTML/CSS 기초",
            "Node.js 실전",
            "프론트엔드 프로젝트 실습",
            "타입스크립트 완전정복",
            "Next.js로 웹 앱 만들기",
            "Git과 GitHub",
            "REST API 이해하기",
            "UI/UX 디자인 기초",
            "파이어베이스 시작하기",
            "웹 보안과 HTTPS",
            "브라우저 동작 원리",
            "React Hooks 제대로 쓰기",
            "Redux Toolkit 입문",
            "Zustand로 상태 관리",
            "API 연동 실습",
            "포트폴리오 프로젝트",
            "테스트 코드 작성법",
            "웹 접근성과 반응형 디자인",
            "React Query 마스터",
            "모던 자바스크립트 문법",
            "서버리스 백엔드 이해",
            "웹 퍼포먼스 최적화",
            "웹 앱 배포 전략",
            "소켓을 활용한 실시간 앱",
            "프론트엔드 면접 준비",
            "컴포넌트 설계 패턴",
            "Animation with Framer Motion",
            "실전 타입스크립트 과제",
        ];
        // 중복 없이 강의명 30개 생성
        const lectures = lectureTitles.map((title) => ({
            title,
            instructor: faker.person.fullName(),
            openDate: faker.date.between({
                from: new Date("2023-01-01"),
                to: new Date(),
            }),
            status: faker.helpers.arrayElement(["예정", "진행중", "종료"]),
        }));
        yield prismaClient_1.default.lecture.deleteMany();
        yield prismaClient_1.default.lecture.createMany({
            data: lectures,
        });
        console.log("강의 30개 시드 완료!");
    });
}
seedLectures()
    .catch(console.error)
    .finally(() => prismaClient_1.default.$disconnect());
//# sourceMappingURL=seedLectures.js.map