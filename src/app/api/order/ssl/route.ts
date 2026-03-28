import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'
import Product from '@/model/product.model'
import { auth } from '@/auth'
import { Payment } from '@/model/payment.model'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const items = body.items || []

    if (!items.length) {
      return NextResponse.json({ message: 'No items found' }, { status: 400 })
    }

    const tran_id = uuidv4()

    // ✅ get all products
    const productIds = items.map((i: any) => i.productId)
    const products = await Product.find({ _id: { $in: productIds } })
    // console.log("products",products)
    // ✅ prepare order products
    const orderProducts = items.map((i: any) => {
      const product = products.find((p) => p._id.toString() === i.productId)

      return {
        product: product._id,
        quantity: i.quantity,
        price: product.price,
      }
    })

    const productsTotalPrice = orderProducts.reduce(
      (acc: any, p: any) => acc + p.price * p.quantity,
      0,
    )

    const totalAmount =
      productsTotalPrice + body.deliveryCharge + body.serviceCharge

    // ✅ create order
    const groupedByVendor: any = {}

    orderProducts.forEach((item: any) => {
      const vendor = products
        .find((p) => p._id.toString() === item.product.toString())
        .vendor.toString()

      if (!groupedByVendor[vendor]) {
        groupedByVendor[vendor] = []
      }

      groupedByVendor[vendor].push(item)
    })
    // console.log("groupedByVendor", groupedByVendor)
    const createdOrders = []

    for (const vendor in groupedByVendor) {
      const vendorProducts = groupedByVendor[vendor]

      const vendorTotal = vendorProducts.reduce(
        (acc:any, p:any) => acc + p.price * p.quantity,
        0,
      )

      const order = await Order.create({
        products: vendorProducts,
        buyer: session.user.id,
        productVendor: vendor,
        productsTotalPrice: vendorTotal,
        deliveryCharge: 0,
        serviceCharge: 0,
        totalAmount: vendorTotal,
        paymentMethod: 'ssl',
        tranId: tran_id,
        address: body.address,
      })

      createdOrders.push(order)
    }

    // ✅ payment
    await Payment.create({
      orderIds: createdOrders.map(o => o._id),
      tranId: tran_id,
      amount: totalAmount,
      currency: 'BDT',
      paymentMethod: 'ssl',
      status: 'INITIATED',
    })

    // ✅ SSL request
    const data = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID!,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: totalAmount.toString(),
      currency: 'BDT',
      tran_id,

      success_url: `${process.env.BASE_URL}/api/payment/success`,
      fail_url: `${process.env.BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.BASE_URL}/api/payment/ipn`,

      product_name: 'Multi Product Order',
      product_category: 'Ecommerce',
      product_profile: 'general',

      cus_name: body.address.name,
      cus_email: 'test@gmail.com',
      cus_add1: body.address.address,
      cus_city: body.address.city,
      cus_postcode: body.address.pincode,
      cus_country: 'Bangladesh',
      cus_phone: body.address.phone,
    })

    const response = await fetch(
      'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      },
    )

    const result = await response.json()

    return NextResponse.json({
      url: result.GatewayPageURL,
      tran_id,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: 'Payment initiation failed' },
      { status: 500 },
    )
  }
}
