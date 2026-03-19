import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    connectDB()
    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json(
        { message: 'Order Id not found' },
        { status: 404 },
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
      .sort({ createdAt: -1 })
      
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    order.orderStatus = 'cancelled'
    order.cancelledAt = new Date()
    order.save()
    return NextResponse.json(
      { order, message: 'Order Cancelled successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to cancel order ${error}` },
      { status: 404 },
    )
  }
}
