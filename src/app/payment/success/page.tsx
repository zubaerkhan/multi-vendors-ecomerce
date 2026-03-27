'use client'

import { useSearchParams } from 'next/navigation'

export default function FailPage() {
  const params = useSearchParams()
  const status = params.get('status')

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold text-red-600">
        Payment Success ✅
      </h1>

      {status && (
        <p className="mt-2 text-gray-600">
          Your payment was completed.
        </p>
      )}
    </div>
  )
}