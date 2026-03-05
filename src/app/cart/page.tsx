'use client'

import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CartPage() {
    
  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const getCart = async () => {
    try {
      const result = await axios.get('/api/user/cart/get')
      setCart(result.data.cart || [])
    } catch (error: any) {
      console.log(error?.response?.data?.message)
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
     
      setCart(result.data.updatedUser.cart)
    
    } catch (error: any) {
      alert(error.response.data.message)
    }
  }
  useEffect(() => {
    getCart()
  }, [])

  const handleRemove = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId))
    const result = await axios.post('/api/user/cart/remove', { productId })
   setCart(result.data.updatedUser.cart)
 
    
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
  if (cart.length === 0) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10 text-white text-4xl'>
        Cart Empty 😢
      </div>
    )
  }

  // ✅ Cart Data
  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 p-6 text-white'>
      <div className='max-w-5xl mx-auto space-y-4'>
        {cart.map((item, i) => (
          <div key={i} className='bg-white/10 p-4 rounded-lg flex flex-col md:flex-row gap-4'>
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
              <div className='flex gap-2 mt-3'>
                <button onClick={()=>router.push(`/checkout/${item.product._id}`)} className=' bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded'>
                  Checkout this product
                </button>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className='block  bg-red-400 hover:bg-red-500 transition px-3 py-1 rounded'
                >
                  Remove
                </button>
              </div>
            </div>
            <div className='flex flex-col justify-center'>
              <div className=' block font-bold'>
                Total = {item.product.price * item.quantity} TK
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
