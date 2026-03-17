import { io } from "socket.io-client";

export const connectSocket = (userId) =>
  io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    query: { userId },
    transports: ["websocket"],
  });
