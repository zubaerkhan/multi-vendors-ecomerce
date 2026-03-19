import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/connectDB'
import Order from '@/model/order.model'

export async function POST(req: NextRequest) {
  await connectDB()

  const formData = await req.formData()

  const tran_id = formData.get('tran_id')
  const val_id = formData.get('val_id')

  // 🔐 SSL VALIDATION
  const validationURL = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`

  const res = await fetch(validationURL)
  const data = await res.json()

  if (data.status === 'VALID') {
    await Order.findOneAndUpdate(
      { tran_id },
      { status: 'paid' }
    )

    return NextResponse.redirect(
      `${process.env.BASE_URL}/payment/success`
    )
  } else {
    await Order.findOneAndUpdate(
      { tran_id },
      { status: 'failed' }
    )

    return NextResponse.redirect(
      `${process.env.BASE_URL}/payment/fail`
    )
  }
}