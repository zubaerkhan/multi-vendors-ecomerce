import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existUser = await User.findOne({ email: normalizedEmail });

    if (existUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashPassword,
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
