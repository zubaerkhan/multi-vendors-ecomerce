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
    const { productId, quantity = 1 } = await req.json()

    if (!productId || quantity < 1) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 })
    }

    const user = await User.findById(session?.user.id)

    if (!user || !user.cart) {
      return NextResponse.json(
        { message: 'Users cart is not found' },
        { status: 400 },
      )
    }

    const existingProductInCart = user.cart.find(
      (item: any) => item.product?.toString() === productId.toString(),
    )
    if (!existingProductInCart) {
      return NextResponse.json(
        { message: 'Cart Product is not found' },
        { status: 400 },
      )
    }

    if (existingProductInCart) {
      existingProductInCart.quantity = quantity
    }

    await user.save()

    const updatedUser = await User.findById(user._id).populate('cart.product') // optional

    return NextResponse.json(
      { updatedUser, message: 'Product cart updated successfylly' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { message: `Failted to update cart ${error}` },
      { status: 500 },
    )
  }
}
