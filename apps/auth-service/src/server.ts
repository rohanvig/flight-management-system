import { config } from "dotenv";
config();
import express from "express";
import cors from "helmet";
import { tokenService } from "./services/auth.service.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "auth-service (with refresh tokens)" });
});

app.post("/api/token/generate", (req, res) => {
  const { userId, role, ...extra } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "userId and email required" });
  }

  const { accessToken, refreshToken } = tokenService.generateTokenPair({
    userId,
    role,
    ...extra,
  });

  res.json({ accessToken, refreshToken });
});

app.post("/api/token/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = tokenService.verifyToken(token as string);
    return res.json({ valid: true, payload });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});
app.post("/api/token/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken required" });
  }

  try {
    const { newAccessToken, newRefreshToken } =
      tokenService.verifyAndRotateRefreshToken(refreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

app.listen(4002, () => {
  console.log(`Auth Service running on port  4002`);
});
