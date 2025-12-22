import { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import type { RegisterInput, LoginInput } from "../types/index.js";

export class UserController {
  private service = new UserService();

  
 register = async (req: Request, res: Response) => {
 

  try {
    const input: RegisterInput = req.body;
    const user = await this.service.register(input);
    res.status(201).json({ message: "User created", user });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(400).json({ error: err.message });
  }
};

  login = async (req: Request, res: Response) => {
    try {
      const input: LoginInput = req.body;
      const result = await this.service.login(input);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new Error("Unauthorized");
      const user = await this.service.getProfile(userId);
      res.json(user);
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  };
}