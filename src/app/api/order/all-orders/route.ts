import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import Product from '@/model/product.model'
import User from '@/model/user.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if (!session || !session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { message: 'UnAuthorized User' },
        { status: 401 },
      )
    }
    const orders = await Order.find()
      .populate('buyer', 'name email phone')
      .populate('productVendor', 'name shopName email')
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'title images price category stock vendor replacementDays',
      })
      .sort({ createdAt: -1 })

    return NextResponse.json(orders, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { message: `Failed to get orders ${error}` },
      { status: 500 },
    )
  }
}
