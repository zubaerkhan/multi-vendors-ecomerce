import mongoose, { Document, Model } from 'mongoose'

// 📌 1. TypeScript Interface
export interface IPayment extends Document {
  orderIds: mongoose.Types.ObjectId[]
  tranId: string
  sessionKey?: string | null
  valId?: string | null

  amount: number
  currency: string

  status: 'INITIATED' | 'SUCCESS' | 'FAILED' | 'CANCELLED'

  paymentMethod: 'cod' | 'stripe' | 'ssl'
  provider?: string | null

  gatewayResponse?: any

  cusName?: string
  cusEmail?: string
  cusPhone?: string

  isRefunded: boolean
  refundAmount: number
  refundReason?: string | null

  createdAt: Date
  updatedAt: Date
}

// 📌 2. Schema
const paymentSchema = new mongoose.Schema<IPayment>(
  {
    orderIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
      },
    ],

    tranId: {
      type: String,
      required: true,
      index: true,
    },

    sessionKey: {
      type: String,
      default: null,
    },

    valId: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: 'BDT',
    },

    status: {
      type: String,
      enum: ['INITIATED', 'SUCCESS', 'FAILED', 'CANCELLED'],
      default: 'INITIATED',
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: ['cod', 'stripe', 'ssl'],
      required: true,
    },

    provider: {
      type: String,
      default: null,
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    cusName: String,
    cusEmail: String,
    cusPhone: String,

    isRefunded: {
      type: Boolean,
      default: false,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    refundReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// 📌 3. Index (Performance boost 🚀)
paymentSchema.index({ orderId: 1, status: 1 })
paymentSchema.index({ tranId: 1 })

// 📌 4. Model টাইপ
export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema)
