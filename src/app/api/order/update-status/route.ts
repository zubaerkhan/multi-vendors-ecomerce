import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import { sendDeliveryOtpEmail } from '@/lib/mailer'
import Order from '@/model/order.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  await connectDB()
  const session = await auth()
  if (!session || !session?.user?.email || !session?.user.id) {
    return NextResponse.json({ message: 'UnAuthorized User' }, { status: 401 })
  }

  const { orderId, status } = await req.json()
  try {
    const order = await Order.findById(orderId).populate('buyer')
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    if (status == 'pending') {
      order.orderStatus = status
      await order.save()
      return NextResponse.json(
        { message: 'Order Status Updated' },
        { status: 200 },
      )
    }
    if (status == 'confirmed' || status === 'shipped') {
      order.orderStatus = status
      await order.save()
      return NextResponse.json(
        { message: 'Order Status Updated' },
        { status: 200 },
      )
    }
    if (status === 'delivered') {
      const otp = Math.floor(1000 + Math.random() * 9000).toString()
      order.deliveryOtp = otp
      order.otpExpiresAT = new Date(Date.now() + 10 * 60 * 60 * 1000)
      await order.save()

      const email = order.buyer?.email
      if (!email) {
        return NextResponse.json(
          { message: 'Buyer Email not found!' },
          { status: 200 },
        )
      }

      await sendDeliveryOtpEmail(email, otp)
      return NextResponse.json({
        message: 'OTP Sent to buyer email successfully!',
      })
    }
    return NextResponse.json({ message: 'Invalid status!' }, { status: 400 })
  } catch (error) {
     return NextResponse.json(
          { message: `Failed to Update Order status, ${error}`, },
          { status: 500 },
        )
  }
}
