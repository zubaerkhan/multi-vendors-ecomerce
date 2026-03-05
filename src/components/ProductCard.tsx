'use client'

import { IProduct } from '@/model/product.model'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegStar,
  FaShoppingCart,
  FaStar,
} from 'react-icons/fa'
import { useDispatch } from 'react-redux'

export default function ProductCard({ product }: { product: IProduct }) {
  const router = useRouter()
  const images = product.images?.filter(Boolean) || []
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0)

  const nexImage = () => {
    setCurrent((prev) => (prev + 1) % images.length)
  }
  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }
  const avgRating = product?.reviews?.length
    ? (
        product.reviews.reduce((a, b) => a + b.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const result = await axios.post('/api/user/cart/add', {
        productId: product._id,
        quantity: 1,
      })
 
      dispatch(setUserData(result.data.updatedUser))   
      alert('Add to cart Successfully')
      router.refresh()
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Cart add error')
    }
  }
  return (
    <motion.div
      onClick={() => router.push(`/product-details/${product._id}`)}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      viewport={{ once: true, amount: 0.2 }}
      className='bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition cursor-pointer hover:scale-105 transition'
    >
      <div className='relative w-full h-[220px] bg-gray-100  overflow-hidden flex items-center justify-center'>
        <div className='relative w-[95%] h-[95%] '>
          <Image
            src={images[current]}
            alt={product.title}
            fill
            sizes='(max-width: 768px) 100vw, 300px'
            className='object-contain rounded-md'
          />
        </div>
        {/* button and dot  */}
        <div>
          <button
            onClick={(e) => {
              prevImage()
              e.stopPropagation()
            }}
            className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md rounded-full text-white z-10 p-2'
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={(e) => {
              nexImage()
              e.stopPropagation()
            }}
            className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 backdrop-blur-md rounded-full text-white z-10 p-2'
          >
            <FaChevronRight size={14} />
          </button>
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 '>
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 z-200 rounded-full ${current === i ? 'bg-black' : 'bg-black/40'} `}
              ></span>
            ))}
          </div>
        </div>
      </div>

      {/* product data  */}
      <div className='p-4 space-y-2'>
        <h3 className='font-semibold text-sm text-black line-clamp-1'>
          {product.title}
        </h3>
        <p className='text-xs text-gray-500'>{product.category}</p>
        <p className='font-bold text-lg text-green-600'>{product.price}</p>
        <div className='flex items-center gap-1 text-yellow-500 text-xs'>
          {[1, 2, 3, 4, 5].map((i) =>
            i <= Math.round(Number(avgRating)) ? (
              <FaStar key={i} />
            ) : (
              <FaRegStar key={i} />
            ),
          )}
          <span className='text-gray-500 text-xs ml-1'>
            {avgRating} / ({product?.reviews?.length}){' '}
          </span>
        </div>
        <p className='text-xs text-gray-500'>
          Sold by: <span>{product.vendor.shopName}</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className='w-full mt-3 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition z-50'
          onClick={handleAddToCart}
        >
          <FaShoppingCart size={14} /> Add To Cart
        </motion.button>
      </div>
    </motion.div>
  )
}
