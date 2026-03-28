import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import { Payment } from '@/model/payment.model'
import { auth } from '@/auth'
import User from '@/model/user.model'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
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

    await Order.updateMany(
      { tranId },
      {
        isPaid: true,
        paymentStatus: 'paid',
        orderStatus: 'confirmed',
      },
    )

    const orders = await Order.find({ tranId })

    //   const allProductIds = []

    // orders.forEach(order => {
    //   order.products.forEach(p => {
    //     allProductIds.push(p.product)
    //   })
    // })
    // or
    
    const allProductIds = orders.flatMap((order) =>
      order.products.map((p: any) => p.product),
    )

    await User.updateOne(
      { _id: orders[0].buyer },
      {
        $pull: {
          cart: {
            product: { $in: allProductIds },
          },
        },
      },
    )

    // redirect page without refresh

    return new Response(
      `<html>
    <head>
      <meta http-equiv="refresh" content="0;url=${process.env.BASE_URL}/payment/success" />
    </head>
  </html>`,
      { headers: { 'Content-Type': 'text/html' } },
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'Success handler error' },
      { status: 500 },
    )
  }
}
