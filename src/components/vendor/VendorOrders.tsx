'use client'

import UseGetAllOrders from '@/hooks/UseGetAllOrders'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'

export default function VendorOrders() {
  UseGetAllOrders()
  UseGetCurrentUser()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { userData, allOrdersData } = useSelector(
    (state: RootState) => state.user,
  )

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter(
        (order) => String(order?.productVendor?._id) === String(userData?._id),
      )
    : []
  //------ 2nd method ----------
  // const orders = useMemo(() => {
  //   if (!Array.isArray(allOrdersData) || !userData) return []

  //   return allOrdersData.filter(
  //     (order) => String(order?.productVendor?._id) === String(userData?._id),
  //   )
  // }, [allOrdersData, userData])

  // First charrecter is capital
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
  const [loading, setLoading] = useState(false)
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null)
  const [otpModel, setOtpModel] = useState<any | null>(null)
  const [otp, setOtp] = useState('')

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setLoadingOrderId(orderId)
      const result = await axios.post('/api/order/update-status', {
        orderId,
        status,
      })
      if (status !== 'delivered') {
        dispatch(
          setAllOrdersData(
            allOrdersData.map((o) =>
              String(o._id) === orderId ? { ...o, orderStatus: status } : o,
            ),
          ),
        )
      }
      alert(result?.data?.message)
    } catch (error: any) {
      alert(error?.response?.data?.message)
    } finally {
      setLoadingOrderId(null)
    }
  }
  const statusList = [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'returned',
  ]

  const verifyOTP = async () => {
    try {
      setLoading(true)

      const result = await axios.post('/api/order/verify-delivery-otp', {
        orderId: otpModel._id,
        otp,
      })

      const updatedOrder = result?.data?.order

      if (!updatedOrder) {
        return alert('Something went wrong')
      }

      // console.log('Before update:', allOrdersData)

      const newOrders = allOrdersData.map((o) =>
        String(o._id) === String(updatedOrder._id) ? updatedOrder : o,
      )

      // console.log('New orders:', newOrders)

      dispatch(setAllOrdersData(newOrders))

      alert(result?.data?.message)
      setOtpModel(null)
    } catch (error: any) {
      alert(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='w-full px-3 py-10 sm:px-6 lg:px-1 text-white'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6'>
          Vendor Orders
        </h1>
        <p className='text-gray-300'>{orders.length} Orders</p>
      </div>
      {/* desktop table  */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='p-4'>Order</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'> Products</th>
              <th className='p-4'>Payment</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-400'>
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={index}
                  className='border-t border-white/10 hover:bg-white/5'
                >
                  <td className='p-4'>#{String(order._id).slice(-8)}</td>
                  <td className='p-4'>
                    {order.address.name}
                    <div className='text-xs text-gray-400'>
                      {order.address.phone}
                    </div>
                  </td>
                  <td className='p-4'>
                    {order.products.map((p: any, i) => (
                      <div key={i}>
                        {p.product.title}, Qty-({p.quantity})
                      </div>
                    ))}
                  </td>
                  <td className='p-4'>
                    {order.paymentMethod}
                    <div className='text-xs text-gray-400'>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  <td className='p-4'>{order.orderStatus.toUpperCase()}</td>
                  <td className='p-4 text-center'>
                    {order.orderStatus === 'cancelled' && (
                      <span className='text-red-400 font-semibold capitalize'>
                        Cancelled
                      </span>
                    )}
                    {order.orderStatus === 'delivered' && (
                      <span className='text-green-400 font-semibold capitalize'>
                        Delivered
                      </span>
                    )}
                    {order.orderStatus === 'returned' && (
                      <span className='text-orange-400 font-semibold capitalize'>
                        Returned
                      </span>
                    )}
                    {order.orderStatus !== 'cancelled' &&
                      order.orderStatus !== 'delivered' &&
                      order.orderStatus !== 'returned' && (
                        <select
                          disabled={loadingOrderId === String(order._id)}
                          onChange={(e) => {
                            if (e.target.value === 'delivered') {
                              setOtpModel(order)
                              updateStatus(String(order._id), e.target.value)
                            } else {
                              updateStatus(String(order._id), e.target.value)
                            }
                          }}
                          value={order.orderStatus}
                          className='px-3 py-1 bg-white/10 hover:bg-white/20 text-sm rounded-md cursor-pointer border border-white/20'
                        >
                          {loadingOrderId === String(order._id) ? (
                            <option>Updating...</option>
                          ) : (
                            statusList.map((s, i) => (
                              <option key={i} value={s} className='bg-gray-900'>
                                {capitalize(s)}
                              </option>
                            ))
                          )}
                        </select>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile card  */}
      <div className='md:hidden flex flex-col gap-6'>
        {orders.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>No Orders Found</div>
        ) : (
          orders.map((order, index) => (
            <div
              key={index}
              className='bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 space-y-2 transition'
            >
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>
                  #{String(order._id).slice(-8)}
                </h3>
                <span className='font-bold rounded-full   text-green-400'>
                  {order.totalAmount}
                </span>
              </div>
              <p className='text-sm text-gray-300'>
                <b>Buyer:</b> {order.address.name}
              </p>
              <p className='text-sm text-gray-300'>
                <b>Phone:</b> {order.address.phone}
              </p>
              <div className='mt-2 tex-sm'>
                {order.products.map((p: any, i) => (
                  <div key={i}>
                    {p.product.title}, Qty-({p.quantity})
                  </div>
                ))}
              </div>
              <div className='mt-2 tex-sm'>
                <p className='text-sm text-gray-300'>
                  <b>Status :</b>{' '}
                  <span className='capitalize'>{order.orderStatus}</span>
                </p>
              </div>
              <div>
                {order.orderStatus === 'cancelled' && (
                  <span className='text-red-400 font-semibold capitalize'>
                    Cancelled
                  </span>
                )}
                {order.orderStatus === 'delivered' && (
                  <span className='text-green-400 font-semibold capitalize'>
                    Delivered
                  </span>
                )}
                {order.orderStatus === 'returned' && (
                  <span className='text-orange-400 font-semibold capitalize'>
                    Returned
                  </span>
                )}
                {order.orderStatus !== 'cancelled' &&
                  order.orderStatus !== 'delivered' &&
                  order.orderStatus !== 'returned' && (
                    <select
                      disabled={loadingOrderId === String(order._id)}
                      onChange={(e) => {
                        if (e.target.value === 'delivered') {
                          setOtpModel(order)
                          updateStatus(String(order._id), e.target.value)
                        } else {
                          updateStatus(String(order._id), e.target.value)
                        }
                      }}
                      value={order.orderStatus}
                      className='px-3 py-1 bg-white/10 hover:bg-white/20 text-sm rounded-md cursor-pointer border border-white/20'
                    >
                      {loadingOrderId === String(order._id) ? (
                        <option>Updating...</option>
                      ) : (
                        statusList.map((s, i) => (
                          <option key={i} value={s} className='bg-gray-900'>
                            {capitalize(s)}
                          </option>
                        ))
                      )}
                    </select>
                  )}
              </div>
            </div>
          ))
        )}
      </div>
      {otpModel && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50'>
          <div className='bg-[#061526] p-6 rounded-xl w-full  max-w-md relative'>
            <h2 className='text-lg font-semibold mb-3'>Enter Deliverty OTP</h2>
            <AiOutlineClose
              size={20}
              onClick={() => setOtpModel(null)}
              className='absolute top-2 right-2 cursor-pointer'
            />
            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              type='text'
              inputMode='numeric'
              maxLength={4}
              placeholder='Enter Your 4 digit OTP '
              className='w-full bg-white/10 border border-white/20 px-4 py-2 rounded mb-4'
            />
            <button
              onClick={() => verifyOTP()}
              className='w-full bg-green-600 py-2 rounded flex items-center justify-center gap-2'
            >
              Verify & Deliver
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
