import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import studentsRouter from "./routes/students";
import coursesRouter from "./routes/courses";
import notificationsRouter from "./routes/notifications";
import dashboardRouter from "./routes/dashboard";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000", //프론트엔드 주소
    credentials: true, // 쿠키 허용
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("서버 연결 성공!");
});

app.use("/auth", authRouter);

app.use("/students", studentsRouter);

app.use("/courses", coursesRouter);

app.use("/notifications", notificationsRouter);

app.use("/dashboard", dashboardRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
