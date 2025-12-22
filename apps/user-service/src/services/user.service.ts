import { UserRepository } from "../repository/user.repo.js";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import type { RegisterInput, LoginInput, User } from "../types/index.js";
import axios from "axios";
config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export class UserService {
  constructor(private repo = new UserRepository()) {}

  async register(input: RegisterInput) {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.repo.create({
      ...input,
      password: hashed,
      role: "user",
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(input: LoginInput) {
    const user = await this.repo.findByEmail(input.email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    try {
      // Call auth-service for token generation
      const response = await axios.post(
        `${AUTH_SERVICE_URL}/api/token/generate`,
        {
          userId: user.id,
          role: user.role || "user",
        },
        {
          withCredentials: true,
        }
      );

      const { accessToken } = response.data;

      const { password: _, ...safeUser } = user;
      return { user: safeUser, accessToken };
    } catch (err: any) {
      console.error("Auth service error:", err.message);
      throw new Error("Failed to generate tokens");
    }
  }

  async getProfile(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new Error("User not found");
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
