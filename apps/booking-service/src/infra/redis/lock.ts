import redisClient from "./client.js";

class LockService {
  async acquire(key: string, ttl = 5000): Promise<boolean> {
    const result = await redisClient.set(key, "locked", {
      NX: true,
      PX: ttl,
    });
    return result === "OK";
  }

  async release(key: string): Promise<void> {
    await redisClient.del(key);
  }
}

export const lockService = new LockService();
