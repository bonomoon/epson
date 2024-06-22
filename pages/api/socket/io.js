import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function SocketIoHandler(req, res) {
  if (!res.socket.server.io) {
    res.end();

    const io = new Server(res.socket.server, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
}
