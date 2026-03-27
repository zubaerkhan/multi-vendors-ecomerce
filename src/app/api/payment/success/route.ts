import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import { Payment } from '@/model/payment.model'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.formData()
    const data = Object.fromEntries(body)

    console.log('SSL SUCCESS:', data)

    const tranId = data.tran_id

    await Payment.findOneAndUpdate(
      { tranId },
      {
        status: 'SUCCESS',
        gatewayResponse: data,
      },
    )

    await Order.findOneAndUpdate(
      { tranId },
      {
        isPaid: true,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
      },
    )

  return new Response(
  `<html>
    <head>
      <meta http-equiv="refresh" content="0;url=${process.env.BASE_URL}/payment/success" />
    </head>
  </html>`,
  { headers: { "Content-Type": "text/html" } }
)

  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'Success handler error' },
      { status: 500 },
    )
  }
}
