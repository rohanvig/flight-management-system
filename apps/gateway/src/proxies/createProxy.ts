// src/proxies/createProxy.ts
import { createProxyMiddleware } from "http-proxy-middleware";

export const createServiceProxy = (target: string, stripPrefix: string) => {
  if (!target) {
    throw new Error("Target URL is missing! Check .env file");
  }

  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path: string) => path.replace(stripPrefix, ""),
  });
};
