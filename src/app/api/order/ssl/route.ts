import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const tran_id = uuidv4()

    const data = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID!,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: body.amount.toString(),
      currency: 'BDT',
      tran_id,

      success_url: `${process.env.BASE_URL}/api/payment/success`,
      fail_url: `${process.env.BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.BASE_URL}/api/payment/cancel`,

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
      }
    )

    const result = await response.json()

    console.log('SSL RESPONSE:', result) // 🔍 DEBUG

    // ❌ যদি URL না আসে
    if (!result.GatewayPageURL) {
      return NextResponse.json(
        {
          message: 'SSLCommerz error',
          error: result,
        },
        { status: 400 }
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
      { status: 500 }
    )
  }
}