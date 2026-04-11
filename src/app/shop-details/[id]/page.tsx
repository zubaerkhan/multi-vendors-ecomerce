'use client'
import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { RootState } from '@/redux/store'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useSelector } from 'react-redux'

export default function ShopDetails() {
  const params = useParams()
  const vendorId = params.id as string
  const { allVendorsData, allProductsData } = useSelector(
    (state: RootState) => state.vendors,
  )

  const filterVendor = allVendorsData.find(
    (v: any) => String(v._id) === vendorId,
  )
  if (!filterVendor) {
    return (
      <div className='min-h-[30vh] text-3xl flex items-center justify-center text-white bg-black'>
        Vendor not Found!
      </div>
    )
  }
  const vendorProducts = Array.isArray(allProductsData)
    ? allProductsData.filter((p: any) => p.vendor._id === filterVendor._id)
    : []
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-24 pb-10'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-6xl mx-auto mb-12 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 grid md:grid-cols-2 gap-5 shadow-xl'
      >
        <div className='relative w-full h-60 overflow-hidden rounded-xl bg-black flex items-center justify-center'>
          {filterVendor.image ? (
            <Image
              src={filterVendor.image}
              alt={filterVendor.name}
              fill
              className='object-cover'
            />
          ) : (
            <span className='text-white'>no image found</span>
          )}
        </div>
        <div className='flex flex-col justify-center'>
          <h1 className='text-3xl font-bold mb-3'>{filterVendor.shopName}</h1>
          <p className='text-gray-300 mb-2'>{filterVendor.shopAddress}</p>
          <p className='text-gray-400 mb-1'>{filterVendor.gstNumber}</p>
          <span className='text-[10px] px-3 py-1 rounded-md font-medium bg-green-100 text-green-700 mt-3 w-fit'>
            {filterVendor.verificationStatus}
          </span>
        </div>
      </motion.div>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold mb-8'>
          Product By : {filterVendor.shopName}
        </h2>
        {vendorProducts?.length === 0 ? (
          <p className='text-gray-300'>No Products added by this shop yet</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {vendorProducts?.map((p:any,i)=>(
              <ProductCard product={p} key={i}/>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
