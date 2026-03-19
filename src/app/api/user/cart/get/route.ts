import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Product from '@/model/product.model'
import User from '@/model/user.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const session = await auth()
    if (!session || !session?.user?.email || !session?.user.id) {
      return NextResponse.json(
        { message: 'UnAuthorized User' },
        { status: 400 },
      )
    }
 
    const user = await User.findById(session?.user.id).populate("cart.product")

    if (!user) {
      return NextResponse.json(
        { message: 'User is not found' },
        { status: 400 },
      )
    }
        

   return NextResponse.json(
  { cart: user.cart || [] },
  { status: 200 },
)
  } catch (error) {
    return NextResponse.json(
      { message: `Failt to get cart ${error}` },
      { status: 500 },
    )
  }
}
