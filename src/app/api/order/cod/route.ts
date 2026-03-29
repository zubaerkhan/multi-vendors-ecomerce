import { auth } from '@/auth'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import Product from '@/model/product.model'
import User from '@/model/user.model'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

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
      items,
      address,
      deliveryCharge,
      serviceCharge,
    } = await req.json()

    if (!items || !items.length) {
      return NextResponse.json({ message: 'No items found' }, { status: 400 })
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

    // loop করে order products তৈরি
    const vendorMap: any = {}

    for (const item of items) {
      const product = await Product.findById(item.productId)

      const vendorId = product.vendor.toString()

      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = []
      }

      vendorMap[vendorId].push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const createdOrders = []

    for (const vendorId in vendorMap) {
      const vendorProducts = vendorMap[vendorId]

      const vendorProductsTotal = vendorProducts.reduce(
        (acc: number, p: any) => acc + p.price * p.quantity,
        0,
      )

      const order = await Order.create({
        buyer: session.user.id,
        products: vendorProducts,
        productVendor: vendorId,
        productsTotalPrice: vendorProductsTotal,
        deliveryCharge,
        serviceCharge,
        totalAmount: vendorProductsTotal + deliveryCharge + serviceCharge,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        tranId: uuidv4(),
        isPaid: false,
        orderStatus: 'pending',
        address,
      })

      createdOrders.push(order)
    }

    // cart remove selected items
    const selectedIds = items.map((i: any) => i.productId.toString())

    user.cart = user.cart.filter(
      (i: any) => !selectedIds.includes(i.product.toString()),
    )
    await user.save()

    return NextResponse.json(
      {
        orders: createdOrders,
        updateUser: user,
        message: 'COD Orders placed successfully',
      },
      { status: 201 },
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: `Failed to create order ${error}` },
      { status: 500 },
    )
  }
}
