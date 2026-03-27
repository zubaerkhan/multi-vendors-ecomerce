import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/connectDB"
import Order from "@/model/order.model"
import { Payment } from "@/model/payment.model"

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const body = await req.formData()
    const data = Object.fromEntries(body)

    console.log("SSL IPN:", data)

    const tranId = data.tran_id
    const valId = data.val_id
    const status = data.status

    // already processed? avoid duplicate
    const existingPayment = await Payment.findOne({ tranId })

    if (!existingPayment) {
      return NextResponse.json({ message: "Payment not found" })
    }

    // already success — ignore duplicate IPN
    if (existingPayment.status === "SUCCESS") {
      return NextResponse.json({ message: "Already processed" })
    }

    // ✅ verify from SSL server
    const verifyURL = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`

    const verifyRes = await fetch(verifyURL)
    const verifyData = await verifyRes.json()

    console.log("SSL VERIFY:", verifyData)

    if (verifyData.status === "VALID") {
      // ✅ payment update
      await Payment.findOneAndUpdate(
        { tranId },
        {
          status: "SUCCESS",
          valId,
          gatewayResponse: data,
        }
      )

      // ✅ order update
      await Order.findOneAndUpdate(
        { tranId },
        {
          isPaid: true,
          paymentStatus: "paid",
          orderStatus: "confirmed",
        }
      )

      return NextResponse.json({ message: "IPN success" })
    }

    // ❌ failed verify
    await Payment.findOneAndUpdate(
      { tranId },
      {
        status: "FAILED",
        gatewayResponse: data,
      }
    )

    return NextResponse.json({ message: "IPN failed" })
  } catch (error) {
    console.error("IPN ERROR:", error)

    return NextResponse.json(
      { message: "IPN error" },
      { status: 500 }
    )
  }
}