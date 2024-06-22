import { NextResponse } from "next/server";

export async function POST(req, { socket }) {
    const formData = await req.formData();
    console.log(formData);
    console.log(socket);
    socket.server.io.emit('epson-scan', formData);
    return NextResponse.json(formData);
}