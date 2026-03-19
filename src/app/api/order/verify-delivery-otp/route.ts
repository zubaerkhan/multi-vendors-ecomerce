import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await connectDB()
  const session = await auth()

  if (!session || !session?.user?.email || !session?.user?.id) {
    return NextResponse.json({ message: 'UnAuthorized User' }, { status: 401 })
  }

  const { orderId, otp } = await req.json()

  try {
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: 'Order id and otp are required' },
        { status: 400 },
      )
    }

    const order = await Order.findById(orderId)
      .populate('buyer', 'name email phone')
      .populate('productVendor', 'name shopName email')
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'title images price category stock vendor replacementDays',
      })

    if (!order.deliveryOtp || !order.otpExpiresAT) {
      return NextResponse.json({ message: 'OTP not found' }, { status: 400 })
    }

    if (order.otpExpiresAT < new Date()) {
      return NextResponse.json({ message: 'Expired OTP' }, { status: 400 })
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP!' }, { status: 400 })
    }
    order.orderStatus = 'delivered'
    order.isPaid = true
    order.deliverDate = new Date()
    order.deliveryOtp = undefined
    order.otpExpiresAT = undefined
    await order.save()

    return NextResponse.json(
      { order, message: 'Order Delivered Successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to Update Order status, ${error}` },
      { status: 500 },
    )
  }
}
