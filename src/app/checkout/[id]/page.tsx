'use client'

import axios from 'axios'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaStripe } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'

export default function Checkout() {
  const params = useParams()
  const productId = params.id as string
  const router = useRouter()
  const [item, setItem] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe' | 'ssl'>(
    'cod',
  )
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [loading, setLoading] = useState(false)
  const totalPrice = item?.product?.price * item?.quantity
  const deliveryCharge = item?.product.freeDelivery ? 0 : 50
  const serviceCharge = 30
  const finalTotalPrice = totalPrice + deliveryCharge + serviceCharge
  const codDisabled = !item?.product?.payOnDelivery

  const handlePlaceOrder = async () => {
    // ✅ Validation
    if (!name || !phone || !address || !city || !pincode) {
      alert('Please fill out all address fields!')
      return
    }

    if (!item) {
      alert('Product not found!')
      return
    }

    // ✅ Payload
    const payload = {
      productId,
      quantity: item.quantity,
      address: {
        name,
        phone,
        address,
        city,
        pincode,
      },
      amount: finalTotalPrice,
      deliveryCharge,
      serviceCharge,
    }

    try {
      setLoading(true)

      // 🔥 COD FLOW
      if (paymentMethod === 'cod') {
        const res = await axios.post('/api/order/cod', payload)

        alert(res.data.message || 'Order placed successfully!')
        router.push('/orders')
        return
      }

      // 🔥 SSL (bKash / Nagad / Card)
      if (paymentMethod === 'ssl') {
        const res = await axios.post('/api/order/ssl', payload)

        if (!res?.data?.url) {
          throw new Error('Payment URL not found')
        }

        // ✅ redirect to payment gateway
        window.location.href = res.data.url
        return
      }
    } catch (error: any) {
      console.error(error)

      alert(
        error?.response?.data?.message ||
          error.message ||
          'Something went wrong!',
      )
    } finally {
      setLoading(false)
    }
  }
  // get products
  useEffect(() => {
    if (!productId) {
      alert('product is not found')
      return
    }
    const loadItem = async () => {
      try {
        const result = await axios.get('/api/user/cart/get')

        const foundItem = result?.data?.cart?.find(
          (i: any) => i.product._id.toString() === productId.toString(),
        )

        if (!foundItem) {
          router.replace('/cart')
        }
        setItem(foundItem)
        if (!foundItem.product.payOnDelivery) {
          setPaymentMethod('stripe')
        }
      } catch (error: any) {
        alert(error?.response?.data?.message)
      }
    }
    loadItem()
  }, [productId])

  if (!item) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white text-4xl'>
        Loading...
      </div>
    )
  }

  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 p-6 text-white flex items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-10 grid md:grid-cols-2 gap-8'
      >
        <div className='space-y-5'>
          <h2 className='text-2xl font-bold text-white'>Delivery Address</h2>

          <input
            type='text'
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder='Full name'
            className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition'
          />
          <input
            type='text'
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            placeholder='Phone Number'
            className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition'
          />
          <textarea
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            placeholder='Enter Your Address'
            className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition'
          />
          <div className='grid grid-cols-2 gap-4'>
            <input
              type='text'
              onChange={(e) => setCity(e.target.value)}
              value={city}
              placeholder='City'
              className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition'
            />
            <input
              type='text'
              onChange={(e) => setPincode(e.target.value)}
              value={pincode}
              placeholder='PIN Code'
              className='w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-white/40 transition'
            />
          </div>
        </div>
        <div className='space-y-5'>
          <h2 className='text-2xl font-bold text-white'>Order Summary</h2>
          <div className='flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10'>
            {item?.product?.images && (
              <Image
                src={item?.product?.images[0]}
                alt='Product image'
                width={120}
                height={120}
                className='w-20 h-20 object-contain rounded-lg bg-white'
              />
            )}
            <div>
              <p className='font-semibold text-gray-100'>
                {item?.product?.title}
              </p>
              <p className='text-sm text-gray-400'>
                <b>Price :</b> {item?.product?.price} TK
              </p>
              <p className='text-sm text-gray-400'>
                <b>Qty :</b> {item?.quantity}
              </p>
              <p className='font-bold text-green-400'>
                Total ={' '}
                {totalPrice.toLocaleString('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                })}
              </p>
            </div>
          </div>
          <div className='space-y-2 text-sm text-gray-300'>
            <div className='flex justify-between'>
              <span>Delivery Charge</span>
              <span>TK {deliveryCharge}</span>
            </div>
            <div className='flex justify-between'>
              <span>Service Charge</span>
              <span>TK {serviceCharge}</span>
            </div>
            <div className='flex justify-between border-t border-white/20 text-white font-bold text-lg'>
              <span>Total:</span>
              <span className='text-green-400'>
                {finalTotalPrice.toLocaleString('en-BD', {
                  style: 'currency',
                  currency: 'BDT',
                })}
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <p className='font-semibold text-white'>Payment Method</p>
            <div className='flex gap-4'>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPaymentMethod('cod')}
                disabled={codDisabled}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${paymentMethod === 'cod' ? 'bg-blue-600' : 'bg-white/10'} ${codDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Cash On Delivery
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPaymentMethod('stripe')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${paymentMethod === 'stripe' ? 'bg-blue-600' : 'bg-white/10'}`}
              >
                <FaStripe className='text-xl' />
                Stripe
              </motion.button>
              <motion.button
                onClick={() => setPaymentMethod('ssl')}
                className={`flex-1 py-3 rounded-xl font-semibold ${
                  paymentMethod === 'ssl' ? 'bg-blue-600' : 'bg-white/10'
                }`}
              >
                bKash / Nagad
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePlaceOrder}
              disabled={loading}
              className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 py-4 rounded-2xl font-bold text-lg transition'
            >
              {loading ? (
                <ClipLoader size={20} color='white' />
              ) : paymentMethod === 'cod' ? (
                'Place Order'
              ) : (
                'Pay with bKash / Nagad'
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
