'use client'

import UseGetAllOrders from '@/hooks/UseGetAllOrders'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export default function Orders() {
  UseGetAllOrders()
  UseGetCurrentUser()
  const { userData, allOrdersData } = useSelector(
    (state: RootState) => state.user,
  )
  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.find(
        (order) => String(order.buyer._id) === String(userData?._id),
      )
    : []

  if (!orders) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white text-4xl'>
        Loading...
      </div>
    )
  }
  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 p-6 text-white flex items-center justify-center px-4 py-12'></div>
  )
}
