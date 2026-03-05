'use client'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'
import ProductCard from '../ProductCard'

export default function ProductCardPage() {
  const { allProductsData } = useSelector((state: RootState) => state.vendors)

  const products = Array.isArray(allProductsData)
    ? allProductsData.filter(
        (p: any) => p.isActive === true && p.verificationStatus === 'approved',
      )
    : []

  return (
    <div className='min-h-screen w-full bg-linear-to-br from-gray-900 via-black to-gray-900 py-6'>
      <div className='max-w-7xl mx-auto mb-13 text-center'>
        <h1 className='text-2xl sm:text-3xl font-bold text-white'>
          Explore Verified & Trending Products
        </h1>
        <p className='text-sm text-gray-200'>
          Shop only from approved sellers with guarantedd quality
        </p>
      </div>
      <div className='max-w-7xl mx-auto'>
        {products.length === 0 ? (
          <div>No Products available right now</div>
        ) : (
          <div className='grid grid-cols-1 px-3 sm:px-0 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            {products.map((product:any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
