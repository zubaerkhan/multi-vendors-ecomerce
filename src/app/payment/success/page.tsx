'use client'

import Navbar from '@/components/Navbar'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import {  FaCheckCircle } from 'react-icons/fa'

export default function SuccessPage() {
  const router = useRouter()
  return (
    <div className='min-h-screen  bg-gradient-to-br from-green-900 via-black to-gray-900 px-4 p-6 text-white flex items-center justify-center px-4 py-12 '>
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-white/10 backdrop-blur-xl border border-s-white/20 shadow-md rounded-2xl p-10 max-w-md w-full text-center'
      >
        <motion.div
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className='flex justify-center'
        >
          <FaCheckCircle className='text-green-400 ' size={120} />
        </motion.div>
        <h1 className='flex flex-col items-center gap-2 mt-4 text-3xl font-bold text-gray-400 mt-6'>
          Payment Successful 
        </h1>
        <p>Your order has been reveived and is now being processed</p>
        <motion.button
          onClick={() => router.push('/orders')}
          className='mt-8 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition text-lg '
        >
          Go to Order Page
        </motion.button>
      </motion.div>
    </div>
  )
}
