import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
}
