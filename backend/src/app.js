import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"
import studentRoutes from "./routes/student.route.js"
import courseRoutes from "./routes/course.route.js"
import teacherRoutes from "./routes/teacher.route.js"
import adminRoutes from "./routes/admin.route.js"
import dashboardRoutes from "./routes/dashboard.route.js"
// import indexRoutes from "./routes/index.route.js"

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],  // Frontend + any local
  credentials: true
}));

app.use(cookieParser());
// app.use("/api", indexRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
