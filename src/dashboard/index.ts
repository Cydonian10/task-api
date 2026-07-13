import { Server as SocketIOServer } from "socket.io";
import type http from "node:http";
import { JwtAdapter } from "@/src/common/adapters/jose/jwt-adapter.js";
import { UserService } from "@/src/features/user/user.service.js";

let io: SocketIOServer;

export function setupDashboard(httpServer: http.Server): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token || typeof token !== "string") {
        console.warn("[Dashboard] Rechazo: token ausente");
        return next(new Error("Authentication token required"));
      }

      const payload = await JwtAdapter.verifyToken(token);
      if (!payload) {
        console.warn("[Dashboard] Rechazo: token invalido/expirado");
        return next(new Error("Invalid or expired token"));
      }

      const userService = new UserService();
      const result = await userService.getByEmail(payload.email);

      if (!result.isSuccess()) {
        console.warn(
          `[Dashboard] Rechazo: usuario no encontrado (${payload.email})`,
        );
        return next(new Error("User not found"));
      }

      const user = result.getValue()!;

      console.log(
        `[Dashboard] Auth OK: ${user.email} roles=${JSON.stringify(user.roles)}`,
      );

      socket.data.user = user;
      next();
    } catch (err) {
      console.error("[Dashboard] Rechazo: error inesperado", err);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(
      `[Dashboard] Usuario conectado: ${user.email} (socket ${socket.id})`,
    );

    socket.on("subscribe-project", (projectId: number) => {
      if (!projectId || typeof projectId !== "number") {
        socket.emit("error", { message: "Invalid projectId" });
        return;
      }

      const room = `project:${projectId}`;
      socket.join(room);
      console.log(`[Dashboard] ${user.email} suscrito a project ${projectId}`);
      socket.emit("subscribed", { projectId });
    });

    socket.on("unsubscribe-project", (projectId: number) => {
      if (!projectId || typeof projectId !== "number") {
        socket.emit("error", { message: "Invalid projectId" });
        return;
      }

      const room = `project:${projectId}`;
      socket.leave(room);
      console.log(
        `[Dashboard] ${user.email} desuscrito de project ${projectId}`,
      );
      socket.emit("unsubscribed", { projectId });
    });

    socket.on("disconnect", () => {
      console.log(`[Dashboard] Usuario desconectado: ${user.email}`);
    });
  });

  return io;
}

export function notifyTaskCompleted(data: {
  taskId: number;
  taskTitle: string;
  collaboratorId: number;
  projectId: number;
  completedAt: string;
  projectName: string;
  status: string;
}) {
  if (!io) return;

  const room = `project:${data.projectId}`;
  io.to(room).emit("task-completed", {
    ...data,
    timestamp: new Date().toISOString(),
  });
}
