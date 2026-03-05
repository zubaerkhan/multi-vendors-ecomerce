import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {

  try {
    await connectDB();
    const { shopName, shopAddress, gstNumber } = await req.json();
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthrorized Access" },
        { status: 401 },
      );
    }
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        shopName,
        shopAddress,
        gstNumber,
        verificationStatus: "pending",
        requestAt: new Date(),
      },
      { new: true },
    );
  if (!user) {
      return NextResponse.json(
        { message: "User Not Found" },
        { status: 400},
      );
    }
     return NextResponse.json(
        { message: "Vendor Details updated successfully",user },
        { status: 200},
      );
    
  } catch (error) {
     return NextResponse.json(
        { message: `Edit Vendor Details Error, user ${error}` },
        { status: 500},
      );
  }
}
