import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import User from '@/model/user.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { shopName, shopAddress, gstNumber } = await req.json()
    if (!shopName || !shopAddress || !gstNumber) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 },
      )
    }

    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized Access' },
        { status: 401 },
      )
    }
    const updatedVendor = await User.findOneAndUpdate(
      { email: session?.user?.email },
      {
        shopName,
        shopAddress,
        gstNumber,
        verificationStatus: 'pending',
        requestAt: new Date(),   
        rejectedReason: null,
      },
      { new: true },
    )
    if (!updatedVendor) {
      return NextResponse.json({ message: 'Vendor is Not Found' }, { status: 400 })
    }
    return NextResponse.json(
      { message: 'Vendor verify Again successfully', updatedVendor },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Vendor verify Again Error, ${error}` },
      { status: 500 },
    )
  }
}
