'use client'
import UseGetAllOrders from '@/hooks/UseGetAllOrders'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

export default function UserOrders() {
  UseGetAllOrders()
  const { allOrdersData } = useSelector((state: RootState) => state.user)

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }
  const statusConfig: any = {
    pending: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-300',
      border: 'border border-indigo-500/30',
      label: 'Pending',
    },
    confirmed: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-300',
      border: 'border border-blue-500/30',
      label: 'Confirmed',
    },
    shipped: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-300',
      border: 'border border-yellow-500/30',
      label: 'Shipped',
    },
    delivered: {
      bg: 'bg-green-500/15',
      text: 'text-green-300',
      border: 'border border-green-500/30',
      label: 'Delivered',
    },
    cancelled: {
      bg: 'bg-red-500/15',
      text: 'text-red-300',
      border: 'border border-red-500/30',
      label: 'Cancelled',
    },
    returned: {
      bg: 'bg-orange-500/15',
      text: 'text-orange-300',
      border: 'border border-orange-500/30',
      label: 'Returned',
    },
  }
  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status]

    return (
      <span
        className={`
        ${config?.bg}
        ${config?.text}
        ${config?.border}
        px-3 py-1
        rounded-full
        text-xs
        font-semibold
        capitalize
      `}
      >
        {config?.label}
      </span>
    )
  }

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
  return (
    <div className='w-full px-3 py-10 sm:px-6 lg:px-1 text-white pt-20'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6'>
          Vendor Orders
        </h1>
        <p className='text-gray-300'>{allOrdersData.length} Orders</p>
      </div>
      {/* desktop table  */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='p-4'>Order ID</th>
              <th className='p-4'>Buyer</th>
              <th className='p-4'>Vendor</th>
              <th className='p-4'> Products</th>
              <th className='p-4'>Amount</th>
              <th className='p-4'>Payment</th>
              <th className='p-4'>Status</th>
              <th className='p-4 '>Date</th>
            </tr>
          </thead>
          <tbody>
            {allOrdersData.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-6 text-center text-gray-400'>
                  No Orders Found
                </td>
              </tr>
            ) : (
              allOrdersData.map((order, index) => (
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
                  <td className='p-4'>{order.productVendor.shopName}</td>
                  <td className='p-4'>
                    <div className='space-y-2'>
                      {order.products.map((p: any, i) => (
                        <div
                          key={i}
                          className='border-b border-white/10 pb-1 last:border-b-0'
                        >
                          <div>{p?.product?.title}</div>
                          <div className='text-xs text-gray-400'>
                            Qty: {p.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='p-4'>{order.totalAmount}</td>
                  <td className='p-4'>
                    {order.paymentMethod}
                    <div className='text-xs text-gray-400'>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  
                  <td className='p-4 text-center'>
                    <StatusBadge status={order.orderStatus} />

                    {/* {order.orderStatus === 'cancelled' && (
                      <span className='text-red-400 font-semibold capitalize'>
                        Cancelled
                      </span>
                    )}
                    {order.orderStatus === 'pending' &&(
                      <span className='text-indigo-300 font-semibold capitalize'>
                        Pendding
                      </span>
                    )}
                    {order.orderStatus === 'confirmed' &&(
                      <span className='text-indigo-300 font-semibold capitalize'>
                        confirmed
                      </span>
                    )}
                    {order.orderStatus === 'shipped' &&(
                      <span className='text-indigo-300 font-semibold capitalize'>
                        Shipped
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
                    )} */}
                  </td>
                  <td>{formateDate(String(order.createdAt))}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile card  */}
      <div className='md:hidden flex flex-col gap-6'>
        {allOrdersData.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>No Orders Found</div>
        ) : (
          allOrdersData.map((order, index) => (
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
                <b>Vendor:</b> {order.productVendor.shopName}
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
                  <b>Status :</b> <StatusBadge status={order.orderStatus} />
                </p>
              </div>
              <div className='mt-2 tex-sm'>
                <p className='text-sm text-gray-300'>
                  <b>Order Date :</b>{' '}
                  <span className='capitalize'>
                    {formateDate(String(order.createdAt))}
                  </span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
