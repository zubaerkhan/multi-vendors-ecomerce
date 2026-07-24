import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const vendors = await User.find({ role: "vendor" })
      .populate("vendorProducts")
      .sort({ createdAt: -1 });

    if (!vendors || vendors.length === 0) {
      return NextResponse.json(
        { message: "Vendors are not found" },
        { status: 400 }
      );
    }

    return NextResponse.json({ vendors }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get All Vendors Error ${error}` },
      { status: 500 }
    );
  }
}