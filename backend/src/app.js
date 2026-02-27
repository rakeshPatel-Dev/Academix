import express from "express"
import cors from "cors";
import studentRoutes from "./routes/student.route.js"
import courseRoutes from "./routes/course.route.js"
import teacherRoutes from "./routes/teacher.route.js"

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/teachers", teacherRoutes);



export default app;
