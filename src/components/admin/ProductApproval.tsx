'use client'

import UseGetAllProducts from '@/hooks/useGetAllProducts'
import { IProduct } from '@/model/product.model'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllProductsData } from '@/redux/vendorSlice'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

export default function ProductApproval() {
  UseGetAllProducts()
  const dispatch = useDispatch<AppDispatch>()
  const allProductsData: IProduct[] = useSelector(
    (state: RootState) => state.vendors.allProductsData,
  )
  const pendingProducts = Array.isArray(allProductsData)
    ? allProductsData.filter((p) => p.verificationStatus === 'pending')
    : []

  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [rejectModel, setRejectModel] = useState(false)
  const [rejectedReason, setRejectedReason] = useState('')
  const openReajectReasonArea = () => {
    setRejectModel(true)
    setRejectedReason('')
  }
  
const handleAproved = async () => {
    setLoading(true)
    if (!selectedProduct) return
    try {
      await axios.post('/api/admin/update-product-status', {
        productId: selectedProduct._id,
        status: 'approved',
      })
      const updatedProduct = allProductsData.filter(
        (p) => p._id !== selectedProduct._id,
      )
      dispatch(setAllProductsData(updatedProduct))
      setSelectedProduct(null)
      setLoading(false)
      alert('Product approved')
    } catch (error: any) {
      alert(error?.response?.data?.message)
      setLoading(false)
    }
  }
  const handleRejected = async () => {
    setLoading(true)
    if (!selectedProduct) return
    if (rejectedReason == "") {
      alert('Type rejected reason')
      setLoading(false)
      return
    }
    try {
      await axios.post('/api/admin/update-product-status', {
        productId: selectedProduct._id,
        status: 'rejected',
        rejectedReason,
      })
      const updatedProduct = allProductsData.filter(
        (p) => p._id !== selectedProduct._id,
      )
      dispatch(setAllProductsData(updatedProduct))
      setSelectedProduct(null)
      setLoading(false)
      alert('Product Rejected')
    } catch (error) {
      console.log(error)
      setLoading(false)
      alert('Vendor rejection failed')
    }
  }
  return (
    <div className='w-full px-3 py-10 sm:px-6 lg:px-1  text-white'>
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6'>
        Products Approval Requestes
      </h1>
      {/* desktop table  */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='p-4'>Image</th>
              <th className='p-4'>Title</th>
              <th className='p-4'> Price</th>
              <th className='p-4'>Category</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  No Product Approval request Found
                </td>
              </tr>
            ) : (
              pendingProducts.map((product, index) => (
                <tr
                  key={index}
                  className='border-t border-white/10 hover:bg-white/5'
                >
                  <td className='p-4'>
                    <Image
                      src={product.images[0]}
                      alt='product image 1'
                      width={50}
                      height={50}
                      className='object-cover rounded'
                    />
                  </td>
                  <td className='p-4'>{product.title}</td>
                  <td className='p-4'>
                    <span className='text-xl'>৳ </span>
                    {product.price}
                  </td>
                  <td className='p-4'>{product.category}</td>
                  <td className='p-4'>
                    <span className='px-3 py-1 rounded-full text-sm  bg-yellow-500/30 text-yellow-300'>
                      {product?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4 text-center'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedProduct(product)}
                      className='px-4 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-md cursor-pointer'
                    >
                      Check Details
                    </motion.button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile card  */}
      <div className='md:hidden flex flex-col gap-6'>
        {pendingProducts.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>
            No Product Approvel Request Found
          </div>
        ) : (
          pendingProducts.map((product, index) => (
            <div
              key={index}
              className='bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 space-y-2 transition'
            >
              <div className='flex items-center'>
                <Image
                  src={product.images[0]}
                  alt='product 1'
                  width={50}
                  height={50}
                  className='rounded'
                />
              </div>
              <div>
                <h3 className='font-semibold'>{product.title}</h3>
                <p className='text-sm text-gray-400'>
                  <span className='text-xl'>৳ </span>
                  {product.price}
                </p>
                <p className='text-sm text-gray-300 '>{product.category}</p>
              </div>
              <div>
                <span className='px-3 py-1 rounded-full text-sm  bg-yellow-500/30 text-yellow-300'>
                  {product?.verificationStatus}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProduct(product)}
                className='px-4 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-md cursor-pointer '
              >
                Check Details
              </motion.button>
            </div>
          ))
        )}
      </div>
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 overflow-auto '
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className='bg-gray-900 p-6 rounded-2xl w-full max-w-4xl border border-white/10 m-5 '
            >
              <h3 className='text-xl sm:text-2xl font-bold mb-4'>
                Selected Product Details
              </h3>
              <div className='space-y-2 text-sm '>
                <Image src={selectedProduct.images[0]} alt={"proct image"} width={50} height={50}  className='rounded mb-4'/>
                <div className='space-y-2 text-sm'>
                  <p><b>Title:</b> {selectedProduct.title}</p>
                  <p><b>Price:</b> {selectedProduct.price}</p>
                  <p><b>Category:</b> {selectedProduct.category}</p>
                  <p><b>Description:</b> {selectedProduct.description}</p>
                  <p><b>Status:</b> <span className='text-yellow-400'>{selectedProduct.verificationStatus}</span></p>

                </div>
              </div>
              {/* button */}
              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button
                  disabled={loading}
                  onClick={handleAproved}
                  className='flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm transition'
                >
                  {loading ? <ClipLoader size={24} color='white' /> : 'Aproved'}
                </button>
                <button
                  onClick={openReajectReasonArea}
                  className='flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm transition'
                >
                  Rejected
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className='flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-sm transition'
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {rejectModel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className='bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10'
            >
              <h3 className='text-xl sm:text-2xl font-bold mb-4'>
                Enter Rejected Reason
              </h3>
              <textarea
                onChange={(e) => setRejectedReason(e.target.value)}
                value={rejectedReason}
                className='w-full bg-white/10 border border-white/20 rounded-lg p-3 text-sm'
                rows={3}
                placeholder='Enter rejection reason...'
              ></textarea>

              <div className='flex flex-col sm:flex-row gap-3 mt-6'>
                <button
                  disabled={loading}
                  onClick={() => {
                    handleRejected()
                    setRejectModel(false)
                  }}
                  className='flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm transition'
                >
                  {loading ? (
                    <ClipLoader size={24} color='white' />
                  ) : (
                    'Confirm Reject'
                  )}
                </button>
                <button
                  onClick={() => setRejectModel(false)}
                  className='flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-sm transition'
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
