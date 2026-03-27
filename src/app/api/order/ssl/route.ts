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

    const product = await Product.findById(body.productId)
    if (!product) {
      return NextResponse.json({ message: 'Product not found' })
    }

    const tran_id = uuidv4()

    const productsTotalPrice = product.price * body.quantity
    const totalAmount =
      productsTotalPrice + body.deliveryCharge + body.serviceCharge

    // ✅ Create Order
    const order = await Order.create({
      products: [
        {
          product: product._id,
          quantity: body.quantity,
          price: product.price,
        },
      ],
      buyer: session.user.id,
      productVendor: product.vendor,
      productsTotalPrice,
      deliveryCharge: body.deliveryCharge,
      serviceCharge: body.serviceCharge,
      totalAmount,
      paymentMethod: 'ssl',
      tranId: tran_id,
      address: body.address,
    })

    // ✅ Create Payment
    await Payment.create({
      orderId: order._id,
      tranId: tran_id,
      amount: totalAmount,
      currency: 'BDT',
      paymentMethod: 'ssl',
      status: 'INITIATED',
      cusName: body.address.name,
      cusPhone: body.address.phone,
    })

    // ✅ 3. SSL request
    const data = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID!,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: body.totalAmount.toString(),
      currency: 'BDT',
      tran_id,

      success_url: `${process.env.BASE_URL}/api/payment/success`,
      fail_url: `${process.env.BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.BASE_URL}/api/payment/ipn`,
      product_name: 'Product',
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

    if (!result.GatewayPageURL) {
      return NextResponse.json(
        { message: 'SSLCommerz error', error: result },
        { status: 400 },
      )
    }

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
