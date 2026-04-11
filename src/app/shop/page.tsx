'use client'

import Navbar from '@/components/Navbar'
import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function ShopPage() {
  UseGetAllVendors()
  const router = useRouter()
  const { allVendorsData } = useSelector((state: RootState) => state.vendors)
  const allverifiedVendor = Array.isArray(allVendorsData)
    ? allVendorsData.filter((v: any) => v.verificationStatus === 'approved')
    : []

  if (!allverifiedVendor || allverifiedVendor.length === 0) {
    return (
      <div className='min-h-[30vh] flex items-center justify-center text-white bg-black'>
        No Shop Found
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className='w-full min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4  pt-20 pb-8'>
        <div className='max-w-7xl mx-auto mb-[45px] text-center '>
          <h1 className='text-2xl sm:text-3xl text-center'>
            Explore Trusted Shops & verified Seller
          </h1>
          <p className='text-gray-300 text-sm'>
            Discover verified vendors, authenticate stores & their exclusive
            products
          </p>
        </div>

        <div className='max-w-7xl mx-auto '>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 '>
            {allverifiedVendor.map((v: IUser, i) => (
              <motion.div
                onClick={() => router.push(`shop-details/${v._id}`)}
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                className='will-change-transform bg-white text-black rounded-2xl p-4 cursor-pointer border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300  '
              >
                <div className='relative w-full aspect-[4/3] mb-3 overflow-hidden rounded-xl bg-gray-200 flex items-center justify-center'>
                  {v.image ? (
                    <Image
                      src={v?.image || '/shop.png'}
                      alt={v?.name}
                      fill
                      className='  object-cover'
                    />
                  ) : (
                    <div>No Image Found</div>
                  )}
                </div>
                <div className='flex flex-col justify-center items-center'>
                  <h3 className='font-semibold text-sm'>
                    {v?.shopName || v?.name}
                  </h3>

                  <p className='text-xs text-gray-500 mt-1 line-clamp-2'>
                    {v.shopAddress}
                  </p>
                  <span className='text-[10px] px-3 py-1 rounded-full font-medium bg-green-100 text-green-700 mt-3'>
                    {v.verificationStatus}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
