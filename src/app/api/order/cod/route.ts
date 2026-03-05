import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
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
        { status: 401 },
      )
    }
    const {
      productId,
      quantity,
      address,
      amount,
      deliveryCharge,
      serviceCharge,
    } = await req.json()

    if (!productId || !quantity) {
      return NextResponse.json(
        { message: 'Product Id and quantity required' },
        { status: 400 },
      )
    }
    if (
      !address?.name ||
      !address?.phone ||
      !address?.address ||
      !address?.city ||
      !address?.pincode
    ) {
      return NextResponse.json(
        { message: 'All address fields are required' },
        { status: 400 },
      )
    }
    if (
      typeof amount !== 'number' ||
      typeof deliveryCharge !== 'number' ||
      typeof serviceCharge !== 'number'
    ) {
      return NextResponse.json(
        { message: 'Invalid amount, delivery or service charge' },
        { status: 400 },
      )
    }

    const user = await User.findById(session?.user.id)
    if (!user || !user.cart) {
      return NextResponse.json(
        { message: 'User or cart is not found' },
        { status: 400 },
      )
    }

    const cartItem = user.cart.find(
      (i: any) => i.product.toString() === productId.toString(),
    )

    if (!cartItem) {
      return NextResponse.json(
        { message: 'Prduct not found in cart!' },
        { status: 400 },
      )
    }
    const product = await Product.findById(productId)
    if (!product) {
      return NextResponse.json(
        { message: 'Prduct not found!' },
        { status: 400 },
      )
    }
    if (product.stock < quantity) {
      return NextResponse.json(
        {
          message: `Insufficient stock. Available Stock:  ${product.stock} items`,
        },
        { status: 400 },
      )
    }

    const order = await Order.create({
      buyer: session?.user?.id,
      products: [
        {
          product: product._id,
          quantity,
          price: product.price,
        },
      ],
      productVendor: product.vendor,
      productsTotalPrice: product.price * quantity,
      deliveryCharge,
      serviceCharge,
      totalAmount: amount,
      paymentMethod: 'cod',
      isPaid: false,
      orderStatus: 'pending',
      returnedAmount: 0,
      address,
    })
    // stock kome jabe
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity },
    })

    const updateCart = user.cart.filter(
      (i: any) => i.product.toString() !== productId.toString(),
    )
    user.cart = updateCart
    user.orders.push(order._id)

    await user.save()

    return NextResponse.json(
      { order, updateUser: user, message: 'COD Order placed successfully' },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: `Failed to create order ${error}`, },
      { status: 500 },
    )
  }
}
