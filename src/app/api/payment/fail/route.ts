import connectDB from "@/lib/connectDB"
import Order from "@/model/order.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  await connectDB()

  const formData = await req.formData()
  const tran_id = formData.get('tran_id')

  await Order.findOneAndUpdate(
    { tran_id },
    { status: 'failed' }
  )

  return NextResponse.redirect(
    `${process.env.BASE_URL}/payment/fail`
  )
}