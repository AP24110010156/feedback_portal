import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return Response.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return Response.json({ message: "User already exists" }, { status: 400 });
    }

    const ADMIN_EMAILS = [
      "admin1@example.com",
      "admin2@example.com",
      "admin3@example.com",
      "admin4@example.com",
      "admin5@example.com",
    ];

    const assignedRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    return Response.json({ message: "User created successfully" }, { status: 201 });
  } catch (error: any) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
