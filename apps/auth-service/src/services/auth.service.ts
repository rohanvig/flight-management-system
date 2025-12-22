import { sign, verify, decode } from "jsonwebtoken";
import type { Secret, JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const refreshTokenStore = new Map<string, { userId: string; exp: number }>();

interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export class TokenService {
  private readonly accessSecret: Secret;
  private readonly refreshSecret: Secret;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor() {
    this.accessSecret = process.env.JWT_SECRET!;
    this.refreshSecret = process.env.REFRESH_SECRET!;
    this.accessExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
    this.refreshExpiresIn = process.env.REFRESH_EXPIRES_IN || "30d";

    if (!this.accessSecret || !this.refreshSecret) {
      throw new Error("Both JWT_SECRET and REFRESH_SECRET are required");
    }
  }

  // Generate both tokens
  generateTokenPair(payload: TokenPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessToken = sign(payload, this.accessSecret, {
      expiresIn: this.accessExpiresIn,
    } as SignOptions);

    const refreshToken = sign({ userId: payload.userId }, this.refreshSecret, {
      expiresIn: this.refreshExpiresIn,
    } as SignOptions);

    // Store refresh token with expiry
    const decoded = decode(refreshToken) as { exp: number; userId?: string };
    if (decoded?.exp) {
      refreshTokenStore.set(refreshToken, {
        userId: payload.userId,
        exp: decoded.exp * 1000,
      });
    }

    // Auto cleanup old tokens
    this.cleanupExpiredTokens();

    return { accessToken, refreshToken };
  }

  verifyToken(token: string): TokenPayload {
    try {
      return verify(token, this.accessSecret) as TokenPayload;
    } catch (error) {
      console.error("Token verification error:", error);
      throw new Error("Invalid or expired token");
    }
  }
  // Verify & rotate refresh token
  verifyAndRotateRefreshToken(oldRefreshToken: string): {
    newAccessToken: string;
    newRefreshToken: string;
    payload: TokenPayload;
  } {
    try {
      const decoded = verify(oldRefreshToken, this.refreshSecret) as {
        userId: string;
      };

      const stored = refreshTokenStore.get(oldRefreshToken);
      if (!stored || stored.exp < Date.now()) {
        throw new Error("Refresh token invalid or expired");
      }

      // Invalidate old refresh token
      refreshTokenStore.delete(oldRefreshToken);

      // Generate new tokens
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        this.generateTokenPair({
          userId: decoded.userId,
          email: "refreshed-user", // you can fetch from DB if needed
          role: "user",
          iat: Math.floor(Date.now() / 1000), // Optional: Add issued-at for better payload
        });

      return {
        newAccessToken,
        newRefreshToken,
        payload: {
          userId: decoded.userId,
          email: "refreshed-user",
          role: "user",
        },
      };
    } catch (error: any) {
      throw new Error("Invalid refresh token");
    }
  }

  // Optional: Revoke all refresh tokens for a user (e.g., on logout)
  revokeRefreshTokensForUser(userId: string) {
    for (const [token, data] of refreshTokenStore.entries()) {
      if (data.userId === userId) {
        refreshTokenStore.delete(token);
      }
    }
  }

  private cleanupExpiredTokens() {
    const now = Date.now();
    for (const [token, data] of refreshTokenStore.entries()) {
      if (data.exp < now) {
        refreshTokenStore.delete(token);
      }
    }
  }
}

export const tokenService = new TokenService();
