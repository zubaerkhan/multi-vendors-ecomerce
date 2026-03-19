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

  const { orderId } = await req.json()

  try {
    if (!orderId) {
      return NextResponse.json(
        { message: 'Order id is required' },
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

    if (!orderId) {
      return NextResponse.json({ message: 'Order not found' }, { status: 400 })
    }
    if (order.orderStatus === 'cancelled') {
      return NextResponse.json(
        { message: 'Cancelled order cannot be returned' },
        { status: 400 },
      )
    }
    if (order.orderStatus === 'returned') {
      return NextResponse.json(
        { message: 'Order Already returned' },
        { status: 400 },
      )
    }
    if (order.orderStatus !== 'delivered') {
      return NextResponse.json(
        { message: 'Only delivered Orders can be returned' },
        { status: 400 },
      )
    }
    let returnAmount = 0
    for (const item of order.products) {
        returnAmount +=item.price*item.quantity
    }

    order.orderStatus = "returned"
    order.returnedAmount = returnAmount
    await order.save()

    return NextResponse.json(
      { order, message: 'Order returned Successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to return Order, ${error}` },
      { status: 500 },
    )
  }
}
