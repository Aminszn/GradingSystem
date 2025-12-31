const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");


dotenv.config();

const app = express();

/* =========================
   Global Middleware
   ========================= */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health 
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
  });
});


/* =========================
   Routes (v1)
   ========================= */

const academicRouter = require("./src/routes/v1/academicRouter");
const staffRouter = require("./src/routes/v1/staffRouter");
const studentRouter = require("./src/routes/v1/studentRouter");
const userRouter = require("./src/routes/v1/userRouter");

const systemRouter = require("./src/routes/v1/systemRouter");

app.use("/api/v1/academics", academicRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/system", systemRouter);

/* =========================
   Health Check
   ========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "School Portal API v1 running",
  });
});

/* =========================
   Server
   ========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;