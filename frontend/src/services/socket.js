import { io } from "socket.io-client";

export const connectSocket = (userId) =>
  io("http://localhost:5000", {
    query: { userId },
    transports: ["websocket"],
  });
