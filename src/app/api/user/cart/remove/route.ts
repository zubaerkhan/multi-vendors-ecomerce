import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Product from '@/model/product.model'
import User from '@/model/user.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if (!session || !session?.user?.email || !session?.user.id) {
      return NextResponse.json(
        { message: 'UnAuthorized User' },
        { status: 400 },
      )
    }
    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json(
        { message: 'Product id required' },
        { status: 400 },
      )
    }

    const user = await User.findById(session?.user.id)

    if (!user || !user.cart) {
      return NextResponse.json(
        { message: 'Users cart is not found' },
        { status: 400 },
      )
    }

    const filterProdusts = user.cart.filter(
      (item: any) => item.product?.toString() !== productId.toString(),
    )
    if (!filterProdusts) {
      return NextResponse.json(
        { message: 'Cart Product is not found' },
        { status: 400 },
      )
    }
    user.cart = filterProdusts

    await user.save()

    const updatedUser = await User.findById(user._id).populate('cart.product')

    return NextResponse.json(
      { updatedUser, message: 'Cart product remove successfully'},
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failted to remove cart item ${error}` },
      { status: 500 },
    )
  }
}
