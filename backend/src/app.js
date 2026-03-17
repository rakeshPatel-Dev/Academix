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

app.get("/", (req, res) => {
  res.status(200).json({ message: "Academix Backend is running!" });
});
const allowedOrigins = [
  process.env.FRONTEND_URL
].filter(Boolean);

// Add localhost only in development
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:5173");
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
