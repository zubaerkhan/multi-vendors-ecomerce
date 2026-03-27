import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/connectDB"
import Order from "@/model/order.model"

export async function POST(req: NextRequest) {
  await connectDB()

  const body = await req.formData()
  const data = Object.fromEntries(body)

  const tranId = data.tran_id

  await Order.findOneAndUpdate(
    { tranId },
    {
      paymentStatus: "cancelled",
      orderStatus: "cancelled",
    }
  )

  return NextResponse.redirect(
    new URL("/payment/cancel", process.env.BASE_URL)
  )
}