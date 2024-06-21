import { NextResponse } from "next/server";
import { getSocket } from "../../../../socket.js";

export async function POST(req) {
    const formData = await req.formData();
    console.log(formData);
    const io = getSocket();

    io.emit('epson-scan', formData);
    return NextResponse.json(formData);
}