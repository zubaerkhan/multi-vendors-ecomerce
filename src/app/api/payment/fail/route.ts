import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/connectDB"
import Order from "@/model/order.model"
import { Payment } from "@/model/payment.model"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.formData()
    const data = Object.fromEntries(body)

    console.log("SSL FAIL:", data)

    const tranId = data.tran_id

    // ❌ update payment
    await Payment.findOneAndUpdate(
      { tranId },
      {
        status: "FAILED",
        gatewayResponse: data,
      }
    )

    // ❌ update order
    await Order.findOneAndUpdate(
      { tranId },
      {
        paymentStatus: "failed",
        orderStatus: "cancelled",
      }
    )

    return NextResponse.redirect(
      new URL("/payment/fail", process.env.BASE_URL)
    )

  } catch (error) {
    console.error("FAIL ROUTE ERROR:", error)

    return NextResponse.json(
      { message: "Payment fail handler error" },
      { status: 500 }
    )
  }
}