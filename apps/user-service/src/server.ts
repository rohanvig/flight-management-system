import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import { connectDB } from "./config/db.js";
import { UserController } from "./controllers/user.controller.js";

const app = express();
const controller = new UserController();
config();
connectDB();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "user-service" });
});

app.post("/register", controller.register);
app.post("/login", controller.login);
app.get("/me", (req, res) => {
  controller.me(req, res);
});

app.listen(4001, () => {
  console.log("User Service running on port 4001");
});
