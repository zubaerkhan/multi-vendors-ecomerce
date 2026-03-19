'use client'

import UseGetAllOrders from '@/hooks/UseGetAllOrders'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'

import { useState } from 'react'
import { FiTruck } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'

export default function Orders() {
  UseGetAllOrders()
  UseGetCurrentUser()
  const dispatch = useDispatch<AppDispatch>()
  const { userData, allOrdersData } = useSelector(
    (state: RootState) => state.user,
  )
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [trackOrderModel, setTrackOrderModel] = useState<any | null>(null)

  const orders = Array.isArray(allOrdersData)
    ? allOrdersData.filter(
        (order) => String(order?.buyer?._id) === String(userData?._id),
      )
    : []

  const formateDate = (date: string) => {
    if (!date) {
      return ''
    }
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isCancelDisable = (order: any) => {
    return order.isPaid === true && order.paymentMethod === 'stripe'
  }
  const statusList = ['pending', 'confirmed', 'shipped', 'delivered']
  // track step start
  const renderTrackStep = (currentStatus: string) => {
    const currentIndex = statusList.indexOf(currentStatus)
    return (
      <div className='relative pl-6 '>
        {/* vertical line */}
        <div className='absolute left-7.5 top-0 h-full w-[2px] bg-gray-700'></div>
        <div>
          {statusList.map((step, index) => {
            const completed = index <= currentIndex
            const current = index === currentIndex

            return (
              <div key={step} className='relative mb-6 flex items-start'>
                {/* dot */}
                <div
                  className={`
                w-4 h-4 rounded-full mt-1 z-10
                ${completed ? 'bg-blue-500' : 'bg-gray-500'}
                ${current ? 'ring-4 ring-blue-500/30' : ''}
              `}
                />

                {/* text */}
                <div
                  className={`
                ml-4 text-sm font-medium flex items-center gap-1
                ${completed ? 'text-white' : 'text-gray-400'}
              `}
                >
                  {step.toUpperCase()}
                  <span>{completed ? '✓' : ''}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
  // track step ent

  const handleCancel = async (orderId: string) => {
    try {
      const result = await axios.post('api/order/cancel-order', { orderId })
      const updateOrder = result.data.order

      const newOrders = allOrdersData.map((o: any) =>
        String(o._id) === String(updateOrder._id) ? updateOrder : o,
      )

      dispatch(setAllOrdersData(newOrders))
      alert(result?.data?.message)
      setSelectedOrder(null)
    } catch (error: any) {
      alert(error?.data?.response?.message)
    }
  }

  const isEligibleReturn = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) return false
    const deliveredAt = new Date(deliveryDate).getTime()
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000
    return Date.now() <= expiry
  }
  const remainingDays = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) return 0
    const deliveredAt = new Date(deliveryDate).getTime()
    const expiry = deliveredAt + replacementDays * 24 * 60 * 60 * 1000
    const diff = expiry - Date.now()
    if (diff <= 0) return 0
    return Math.ceil(diff / (24 * 60 * 60 * 1000))
  }
  const returnedEndDate = (deliveryDate: string, replacementDays: number) => {
    if (!deliveryDate || !replacementDays) return null
    const deliveredAt = new Date(deliveryDate)
    deliveredAt.setDate(deliveredAt.getDate() + replacementDays)

    return deliveredAt
  }

  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 p-6 text-white'>
      <div className='max-w-6xl mx-auto '>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>My Orders</h1>
            <p className='text-sm text-gray-300'>All Orders Placed by you</p>
          </div>
          <div className='text-sm text-gray-300'>{orders.length} Orders</div>
        </div>
        {/* large divice  */}
        <div className='hidden lg:block bg-white/5 border border-white/10 rounded-xl overflow-auto shadow-xl shadow-black/40'>
          <table className='w-full text-left'>
            <thead className='text-xs bg-white/5 border-b border-white/10 text-gray-300 uppercase tracking-wide'>
              <tr>
                <th className='p-4 '>Order ID</th>
                <th className='p-4'>Date</th>
                <th className='p-4'>Prodcuts</th>
                <th className='p-4'>Vendor</th>
                <th className='p-4'>Payment</th>
                <th className='p-4'>Status</th>
                <th className='p-4 text-right'>Total</th>
                <th className='p-4 text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length !== 0 ? (
                orders.map((order, i) => (
                  <tr
                    key={i}
                    className='border-t border-white/5  hover:bg-white/10 hover:bg-white/10 transition-all duration-200'
                  >
                    <td className='p-4 text-sm'>
                      #{String(order._id).slice(-8)}
                    </td>
                    <td className='p-4 text-sm'>
                      {formateDate(String(order.createdAt))}
                    </td>
                    <td className='p-4 text-sm'>
                      {order.products.map((p, i) => (
                        <div key={i} className='text-gray-200'>
                          {p.product.title} - Qty ({p.quantity})
                        </div>
                      ))}
                    </td>
                    <td className='p-4 text-sm'>
                      {order.productVendor.shopName}
                    </td>
                    <td className='p-4 text-sm text-center'>
                      {order.paymentMethod.toUpperCase()}{' '}
                      <div
                        className={`text-xs ${order.isPaid ? 'text-green-300' : 'text-yellow-300'}`}
                      >
                        {order.isPaid ? 'paid' : 'Pending'}
                      </div>
                    </td>
                    <td className='p-4 text-sm '>
                      {order.orderStatus.toUpperCase()}
                    </td>
                    <td className='p-4 text-right text-green-300 font-semibold'>
                      {order.totalAmount.toLocaleString('en-BD', {
                        style: 'currency',
                        currency: 'BDT',
                      })}
                    </td>
                    <td className='p-4 text-sm'>
                      {order.orderStatus === 'cancelled' && (
                        <span className='text-red-400 font-semibold flex justify-center'>
                          Cancelled
                        </span>
                      )}

                      {order.orderStatus !== 'cancelled' &&
                        order.orderStatus !== 'returned' && (
                          <div className='flex gap-2 '>
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className='px-3 py-1 bg-white/10 rounded hover:bg-white/20'
                            >
                              Check Details
                            </button>

                            <button
                              disabled={order.orderStatus === 'delivered'}
                              onClick={() => setTrackOrderModel(order)}
                              className={`px-3 py-1  rounded flex items-center justify-center gap-1 text-nowrap
                            ${order.orderStatus === 'delivered' ? 'cursor-not-allowed bg-green-500/20 text-green-400 ' : 'bg-white/10 hover:bg-white/20 '}}
                            `}
                            >
                              <FiTruck size={14} />
                              {order.orderStatus === 'delivered' ? (
                                'Delivered'
                              ) : (
                                <span>Track Order</span>
                              )}
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='text-center text-gray-400 p-6' colSpan={8}>
                    {' '}
                    NO Orders found{' '}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* small device  */}
        <div className='lg:hidden space-y-4'>
          {orders.length !== 0 ? (
            orders.map((order, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className='bg-white/5 border border-white/10 p-4 rounded-xl'
              >
                <div className='flex justify-between'>
                  <div>
                    <div className='text-sm text-gray-300'>
                      {' '}
                      #{String(order._id).slice(-8)}
                    </div>
                    <div className='font-semibold'>
                      {formateDate(String(order.createdAt))}
                    </div>
                    <div className='text-sm text-gray-300 mt-1'>
                      {order.productVendor.shopName}
                    </div>
                  </div>
                  <div className='text-green-300 font-bold text-right'>
                    {order.totalAmount.toLocaleString('en-BD', {
                      style: 'currency',
                      currency: 'BDT',
                    })}
                  </div>
                </div>
                <div className='mt-3 flex justify-between'>
                  <div>
                    <div className='text-md text-gray-400'>
                      Pyament method: {order.paymentMethod.toUpperCase()}
                    </div>
                    <div
                      className={`text-sm font-semibold ${order.isPaid ? 'text-green-400' : 'text-yellow-400'}`}
                    >
                      {order.isPaid ? 'paid' : 'Pending'}
                    </div>
                  </div>
                  <div>
                    <div className='text-right'>
                      <div className='text-gray-300 text-sm'>Status: </div>
                      <div>{order.orderStatus.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
                <div className='mt-3 space-y-1'>
                  {order.products.map((p, i) => (
                    <div key={i} className='text-gray-200 text-sm'>
                      {p.product.title} - Qty ({p.quantity})
                    </div>
                  ))}
                </div>
                {order.orderStatus === 'cancelled' && (
                  <span className='text-red-400 font-semibold flex justify-end'>
                    Cancelled
                  </span>
                )}
                {order.orderStatus !== 'cancelled' &&
                  order.orderStatus !== 'returned' && (
                    <div className='flex justify-between gap-2 mt-4'>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className='flex-1 px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition-all'
                      >
                        Check Details
                      </button>
                      <button
                        disabled={order.orderStatus === 'delivered'}
                        onClick={() => setTrackOrderModel(order)}
                        className={`px-3 py-1  rounded flex items-center justify-center gap-1 text-nowrap
                            ${order.orderStatus === 'delivered' ? 'cursor-not-allowed bg-green-500/20 text-green-400 ' : 'bg-white/10 hover:bg-white/20 '}}
                            `}
                      >
                        <FiTruck size={14} />
                        {order.orderStatus === 'delivered' ? (
                          'Delivered'
                        ) : (
                          <span>Track Order</span>
                        )}
                      </button>
                    </div>
                  )}
              </motion.div>
            ))
          ) : (
            <div className='text-5xl text-white flex justify-center items-center min-h-screen'>
              No Orders found
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-auto'
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation()
              }}
              className='relative z-10 w-full max-w-3xl bg-[#061526] border border-white/10 shadow-2xl shadow-black/40 rounded-xl p-6'
            >
              <h2 className='text-lg font-semibold'>
                Order Details #{String(selectedOrder._id).slice(-8)}
              </h2>
              <p className='text-sm text-gray-300'>
                {formateDate(String(selectedOrder.createdAt))}
              </p>
              <hr className='my-4 border-white/10' />
              <h3 className='font-semibold mb-2'>Product</h3>
              {selectedOrder.products.map((p: any, i: any) => (
                <div
                  key={i}
                  className='flex justify-between bg-white/5 p-3 rounded mb-2 '
                >
                  <div>
                    <div className='font-medium'>{p.product.title}</div>
                    <div className=''>
                      Qty: {p.quantity} - Price :{' '}
                      {p.price.toLocaleString('en-BD', {
                        style: 'currency',
                        currency: 'BDT',
                      })}{' '}
                    </div>
                  </div>
                </div>
              ))}
              <hr className='my-4 border-white/10' />
              <h3 className='font-semibold mb-2'>Invoice</h3>
              <div className='text-sm space-y-1'>
                <div className='flex justify-between'>
                  <span>Products Total</span>
                  <span>
                    {selectedOrder.productsTotalPrice.toLocaleString('en-BD', {
                      style: 'currency',
                      currency: 'BDT',
                    })}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery Charge</span>
                  <span>
                    {selectedOrder.deliveryCharge.toLocaleString('en-BD', {
                      style: 'currency',
                      currency: 'BDT',
                    })}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span>Service Charge</span>
                  <span>
                    {selectedOrder.serviceCharge.toLocaleString('en-BD', {
                      style: 'currency',
                      currency: 'BDT',
                    })}
                  </span>
                </div>
              </div>
              <hr className='my-4 border-white/10' />
              <div className='flex justify-between font-semibold text-green-300'>
                <span>Final Total</span>
                <span>
                  {selectedOrder.totalAmount.toLocaleString('en-BD', {
                    style: 'currency',
                    currency: 'BDT',
                  })}
                </span>
              </div>
              {selectedOrder.orderStatus === 'delivered' &&
                selectedOrder.deliverDate && (
                  <div className='mt-3 text-sm text-green-400'>
                    {' '}
                    Delivered on:{' '}
                    {new Date(selectedOrder.deliverDate).toLocaleDateString(
                      'en-IN',
                    )}
                  </div>
                )}

              {selectedOrder.isPaid == true &&
                selectedOrder.paymentMethod == 'stripe' && (
                  <div className='bg-yellow-500/10 border-yellow-500/30 text-yellow-300 text-xs rounded-lg p-3 mt-4'>
                    <p className='font-semibold mb-1'>Imortant Note:</p>
                    <ul className='list-disc pl-4 space-y-1'>
                      <li>
                        Order cancellation feature is{' '}
                        <b>
                          not available if payment is done using online payment
                          (Stripe)
                        </b>
                      </li>
                      <li>
                        You can only <b>return the product </b> after delivery.
                      </li>
                      <li>
                        On return, you will receive only the{' '}
                        <b>product amount</b>
                      </li>
                      <li>
                        <b>Delivery & service Charge are non-refundable.</b>
                      </li>
                    </ul>
                  </div>
                )}
              <div className='flex flex-col md:flex-row justify-end gap-3 mt-6'>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className='px-4 py-2 bg-red-400 hover:bg-red-500 rounded transition'
                >
                  Close
                </button>
                <button
                  disabled={selectedOrder.orderStatus === 'delivered'}
                  onClick={() => setTrackOrderModel(selectedOrder)}
                  className={`px-3 py-1  rounded flex items-center justify-center gap-1 text-nowrap
                            ${selectedOrder.orderStatus === 'delivered' ? 'cursor-not-allowed bg-green-500/20 text-green-400 ' : 'bg-white/10 hover:bg-white/20 '}}
                            `}
                >
                  <FiTruck size={14} />
                  {selectedOrder.orderStatus === 'delivered' ? (
                    'Delivered'
                  ) : (
                    <span>Track Order</span>
                  )}
                </button>
                {selectedOrder.orderStatus !== 'delivered' ? (
                  <button
                    onClick={() => handleCancel(selectedOrder._id)}
                    className={`px-4 py-2 bg-blue-500 rounded transition ${isCancelDisable(selectedOrder) ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    Cancel Order
                  </button>
                ) : (
                  selectedOrder.products.map((p: any, i: number) => {
                    const replacementDays = p.product.replacementDays || 0
                    const eligible = isEligibleReturn(
                      selectedOrder.deliverDate,
                      replacementDays,
                    )
                    const remaining = remainingDays(
                      selectedOrder.deliverDate,
                      replacementDays,
                    )
                    const returnEndDate = returnedEndDate(
                      selectedOrder.deliverDate,
                      replacementDays,
                    )

                    return (
                      <div 
                        key={i}
                        className='flex justify-between  items-center bg-white/5 px-3 py-2 rounded ml-2'
                      >
                        <div>
                          <p className='text-xs text-gray-300 '>
                            {p.product?.title}
                          </p>
                          {remaining ? (
                            <>
                              <p className='text-xs text-yellow-400 '>
                                Return avilable for {remaining} day
                                {remaining > 1 ? 's' : ''}
                              </p>
                              {returnEndDate && (
                                <p className='text-[11px] text-gray-400'>
                                  Return till:{' '}
                                  {returnEndDate.toLocaleDateString('en-IN')}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className='text-xs text-red-400'>
                              Return window closed
                            </p>
                          )}
                        </div>
                          {eligible &&(<button className='mx-3 px-3 py-1 bg-yellow-600 rounded text-sm'>Return</button>)}
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {trackOrderModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-auto h-screen'
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation()
              }}
              className='relative z-10 w-full max-w-md bg-[#061526] border border-white/10 shadow-2xl shadow-black/40 rounded-xl p-6'
            >
              <h2 className='text-2xl font-semibold'>Track Order</h2>
              <div className='text-sm text-gray-300 mb-4 leading-relaxed space-y-2'>
                <h2 className='text-lg font-bold'>Complete Delivery Address</h2>
                <div className='flex justify-start gap-2'>
                  <span>Buyer Name : </span>
                  <span>{trackOrderModel.address.name}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>Delivery Address : </span>
                  <span>{trackOrderModel.address.address}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>City : </span>
                  <span>{trackOrderModel.address.city}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>PinCode : </span>
                  <span>{trackOrderModel.address.pincode}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>Mobile No : </span>
                  <span>{trackOrderModel.address.phone}</span>
                </div>
              </div>
              {renderTrackStep(trackOrderModel.orderStatus)}
              <button
                onClick={() => setTrackOrderModel(null)}
                className='px-4 py-2 bg-white/5 hover:bg-white/10 rounded transition'
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
