import express from "express";
import http from "http";
import ws from "ws";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import * as trpcExpress from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

import { appRouter } from "./routes";
import { createHTTPContext, createWSContext } from "./utils/context";
import customConfig from "./config/default";
import connectDB from "./utils/prisma";

// Хак, так как адаптер tRPC пытается отослать ивенты в закрытое WS-соединение
process.on("uncaughtException", (err) => {
  if (err.message.includes("WebSocket is not open")) {
    console.warn("[uncaughtException] suppressed:", err.message);
    return;
  }
  // иначе — шлём дальше, чтобы не скрыть реальные проблемы
  throw err;
});

const PORT = customConfig.port;

// ————————————————————————————————————
// 1) Express + HTTP tRPC
// ————————————————————————————————————
const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(cookieParser());
app.use(
  cors({
    origin: [customConfig.origin, "http://localhost:3000"],
    credentials: true,
  })
);
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createHTTPContext, // ← здесь остаётся ваш оригинальный createContext
  })
);

// ————————————————————————————————————
// 2) Объединяем HTTP и WS на одном порту
// ————————————————————————————————————
const server = http.createServer(app);
const wss = new ws.Server({
  server,
  path: "/trpc", // тот же путь, что и HTTP-эндпоинт
});

applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createWSContext as any,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

// ————————————————————————————————————
// 3) Стартуем сервер
// ————————————————————————————————————
server.listen(PORT, async () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
  console.log(`   ↳ tRPC HTTP  -> http://localhost:${PORT}/trpc`);
  console.log(`   ↳ tRPC WS    -> ws://localhost:${PORT}/trpc`);
  await connectDB();
});
