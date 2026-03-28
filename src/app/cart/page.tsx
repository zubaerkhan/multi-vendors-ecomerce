'use client'

import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartPage() {
  UseGetCurrentUser()
  const [cart, setCart] = useState<any[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getCart = async () => {
    try {
      const result = await axios.get('/api/user/cart/get', {
        withCredentials: true,
      })

      if (!result || !result.data) {
        setCart([])
        return
      }

      setCart(result?.data?.cart ?? [])
    } catch (error: any) {
      console.log(error)
      setCart([])
    } finally {
      setLoading(false)
    }
  }
  const handleUpdateCart = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) {
        alert('Quantity Must be more than one')
        return
      }
      const result = await axios.post('/api/user/cart/update', {
        productId,
        quantity,
      })

      setCart(result?.data?.updatedUser?.cart)
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Something went wrong')
    }
  }
  useEffect(() => {
    getCart()
  }, [])

  const handleRemove = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId))
    const result = await axios.post('/api/user/cart/remove', { productId })
    setCart(result?.data?.updatedUser?.cart || [])
  }

  // ✅ Loading UI
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10 text-white text-4xl'>
        Loading Cart...
      </div>
    )
  }

  // ✅ Empty Cart
  if (cart?.length === 0) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10 text-white text-4xl'>
        Cart Empty 😢
      </div>
    )
  }

  // ✅ Cart Data
  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 p-6 text-white '>
      <div className='flex flex-col items-end max-w-5xl mx-auto space-y-4 border border-white/10 p-5 rounded-md'>
        <div>
          {cart.map((item, i) => (
            <div
              key={i}
              className='bg-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4  mt-5'
            >
              <input
                className='w-5'
                type='checkbox'
                checked={selectedItems.includes(item.product._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems([...selectedItems, item.product._id])
                  } else {
                    setSelectedItems(
                      selectedItems.filter((id) => id !== item.product._id),
                    )
                  }
                }}
              />
              <Image
                src={item.product.images[0]}
                alt={item.product.title}
                width={100}
                height={100}
              />
              <div className='flex-1'>
                <h3 className='font-bold'>{item.product.title}</h3>
                <p className='text-green-500'>{item.product.price} TK</p>
                <div className='flex gap-2 mt-2'>
                  <button
                    onClick={() =>
                      handleUpdateCart(item.product._id, item.quantity - 1)
                    }
                    className='border border-gray-400 px-2 rounded text-md  cursor-pointer mr-1'
                  >
                    -
                  </button>
                  <span className='text-white'>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateCart(item.product._id, item.quantity + 1)
                    }
                    className='border border-gray-400 px-2 rounded text-md  cursor-pointer mr-1'
                  >
                    +
                  </button>
                </div>
                <div className='flex gap-2 mt-3'></div>
              </div>
              <div className='flex flex-col justify-center justify-between'>
                <div className='flex justify-end'>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className='block  bg-red-400 hover:bg-red-500 transition px-3 py-1 rounded text-xl'
                  >
                    x
                  </button>
                </div>
                <div className=' block font-bold'>
                  Total = {item.product.price * item.quantity} TK
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={() => {
              if (selectedItems.length === 0) {
                alert('Please select product')
                return
              }
              router.push(`/checkout?items=${selectedItems.join(',')}`)
            }}
            className=' bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded'
          >
            Checkout product{selectedItems.length > 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
