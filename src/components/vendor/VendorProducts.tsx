'use client'

import UseGetAllProducts from '@/hooks/useGetAllProducts'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllProductsData } from '@/redux/vendorSlice'
import axios from 'axios'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

export default function VendorProducts() {
  UseGetCurrentUser()
  UseGetAllProducts()
  const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.user.userData)
  const { allProductsData } = useSelector((state: RootState) => state.vendors)
  const dispatch = useDispatch<AppDispatch>()

  const myProducts =
    currentUser?._id && allProductsData?.length
      ? allProductsData.filter(
          (p: any) =>
            p.vendor === currentUser?._id || p.vendor?._id === currentUser?._id,
        )
      : []

  const toggleIsActive = async (
    productId: string,
    currentIsActive: boolean,
  ) => {
    try {
      const result = await axios.post('/api/vendor/isactive-product', {
        productId,
        isActive: !currentIsActive,
      })
      console.log(result)
      const updatedProducts = allProductsData.map((p: any) =>
        p._id === productId ? result.data : p,
      )
      dispatch(setAllProductsData(updatedProducts))
       
     } catch (error: any) {
      alert(error?.response?.data?.message)
    }
  }
  return (
    <div className='w-full px-3 py-15 sm:px-6 lg:px-1  text-white'>
      {/* header  */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold'> My Products</h1>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/add-vendor-product')}
          className='bg-blue-600 hover:bg-blue-700 py-2 px-2 sm:px-5 font-semibold text-sm sm:text-base rounded-md transition cursor-pointer'
        >
          + Add Product
        </motion.button>
      </div>
      {/* desktop table  */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='p-4'>Image</th>
              <th className='p-4'>Title</th>
              <th className='p-4'> Price</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Active</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {myProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  No Vendors Approval request Found
                </td>
              </tr>
            ) : (
              myProducts.map((p, index) => (
                <tr
                  key={index}
                  className='border-t border-white/10 hover:bg-white/5'
                >
                  <td className='p-4 '>
                    <Image
                      src={p.images[0]}
                      alt='image1'
                      width={50}
                      height={50}
                      className='rounded object-cover'
                    />
                  </td>
                  <td className='p-4'>{p.title}</td>
                  <td className='p-4'>Tk-{p.price}</td>
                  <td className='p-4'>
                    <span
                      className={`${p.verificationStatus === 'approved' ? 'text-green-400' : p.verificationStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}
                    >
                      {p?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4 text-center'>
                    <span
                      className={`text-sm  ${p.isActive ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {p?.isActive ? 'Active' : 'InActive'}
                    </span>
                  </td>
                  <td className='p-4 text-center flex flex-col gap-2'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => router.push(`/update-product/${p._id}`)}
                      className='px-3 py-1 rounded text-sm  bg-purple-600 hover:bg-purple-700'
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        toggleIsActive(String(p._id), Boolean(p.isActive))
                      }
                      disabled={p.verificationStatus !== 'approved'}
                      className={`px-3 py-1 text-sm rounded ${p.verificationStatus === 'approved' ? 'bg-green-600' : 'bg-gray-600 cursor-not-allowed'}`}
                    >
                      {p?.isActive ? 'Disabled' : 'Enable'}
                    </motion.button>

                    {p.verificationStatus == 'rejected' && (
                      <div className='mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-2 rounded'>
                        <p>
                          <b>Rejected:</b>{' '}
                          {p.rejectedReason || 'No Reason Provided'}
                        </p>
                        <p className='mt-1 text-yellow-300'>
                          After edit, product will be sent for re-verification.
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile card  */}
      <div className='md:hidden flex flex-col gap-6 '>
        {myProducts.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>
            No Vendor Approver Request Found
          </div>
        ) : (
          myProducts.map((p, index) => (
            <div
              key={index}
              className='bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 space-y-2 transition relative'
            >
              <div className='flex items-center gap-3'>
                <div className='h-[50]'>
                  <Image
                    src={p.images[0]}
                    alt='image1'
                    width={60}
                    height={60}
                    className='rounded object-cover'
                  />
                </div>
              </div>
              <div>
                <h2 className='font-semibold'>{p.title}</h2>
                <p className='text-sm text-gray-300'>{p.price}</p>
              </div>
              <div className='mt-3 text-sm space-y-1'>
                <p>
                  <b>Status:</b>{' '}
                  <span
                    className={`${p.verificationStatus === 'approved' ? 'text-green-400' : p.verificationStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}
                  >
                    {p.verificationStatus}
                  </span>
                </p>
                <p>
                  <b>Active:</b>{' '}
                  <span
                    className={p.isActive ? 'text-green-400' : 'text-red-400'}
                  >
                    {p.isActive ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
              {p.verificationStatus == 'rejected' && (
                <div className='mt-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-2 rounded'>
                  <p>
                    <b>Rejected:</b> {p.rejectedReason || 'No Reason Provided'}
                  </p>
                  <p className='mt-1 text-yellow-300'>
                    After edit, product will be sent for re-verification.
                  </p>
                </div>
              )}
              <div className='flex flex-col gap-2 w-[100] absolute top-2 right-2'>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => router.push(`/update-product/${p._id}`)}
                  className='px-3 py-1 rounded text-sm  bg-purple-600 hover:bg-purple-700'
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    toggleIsActive(String(p._id), Boolean(p.isActive))
                  }
                  disabled={p.verificationStatus !== 'approved'}
                  className={`px-3 py-1 text-sm rounded ${p.verificationStatus === 'approved' ? 'bg-green-600' : 'bg-gray-600 cursor-not-allowed'}`}
                >
                  {p?.isActive ? 'Disabled' : 'Enable'}
                </motion.button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
