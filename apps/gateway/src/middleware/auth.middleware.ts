import type { Request, Response, NextFunction } from "express";
import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/api/token/verify`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      }
    );

    if (response.data.valid) {
      const payload = response.data.payload;
      (req as AuthenticatedRequest).user = payload;
      
      // Pass user info to downstream services via headers
      req.headers["x-user-id"] = String(payload.userId);
      req.headers["x-user-role"] = payload.role;
      req.headers["x-user-email"] = payload.email;
      
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Token verification failed", error: error });
  }
};
