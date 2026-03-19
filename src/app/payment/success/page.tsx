'use client'

import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const params = useSearchParams()

  const tran_id = params.get('tran_id')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-green-500 text-3xl">
      ✅ Payment Successful!
      <p className="text-sm text-white mt-4">
        Transaction ID: {tran_id}
      </p>
    </div>
  )
}