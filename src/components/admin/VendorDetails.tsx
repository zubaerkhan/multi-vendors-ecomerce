'use client'

import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function VendorDetails() {
  UseGetAllVendors()
  const AllVendorsData: IUser[] = useSelector(
    (state: RootState) => state.vendors.allVendorsData,
  )
  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null)

  const ApprovedVendors = Array.isArray(AllVendorsData)
    ? AllVendorsData.filter((v) => v.verificationStatus === 'approved')
    : []

  const productStatusConfig: any = {
    approved: 'bg-green-500/15 text-green-400 border border-green-500/30',
    pending: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    rejected: 'bg-red-500/15 text-red-400 border border-red-500/30',
  }
  return (
    <div className='w-full px-3 py-10 sm:px-6 lg:px-1 text-white'>
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6'>
        Approved Vendor Details
      </h1>
      {/* desktop table  */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='p-4 text-sm'>Vendor Name</th>
              <th className='p-4 text-sm'>Shop Name</th>
              <th className='p-4 text-sm'>Shop Address</th>
              <th className='p-4 text-sm'> Phone</th>
              <th className='p-4 text-sm'>GSTIN</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {ApprovedVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  No Approved Vendor Found
                </td>
              </tr>
            ) : (
              ApprovedVendors.map((vendor, index) => (
                <tr
                  key={index}
                  className='border-t border-white/10 hover:bg-white/5'
                >
                  <td className='p-4 text-sm'>{vendor?.name}</td>
                  <td className='p-4 text-sm'>{vendor?.shopName || '-'}</td>
                  <td className='p-4 text-sm'>{vendor?.shopAddress || '-'}</td>
                  <td className='p-4 text-sm'>{vendor?.phone || '-'}</td>
                  <td className='p-4 text-sm'>{vendor?.gstNumber || '-'}</td>
                  <td className='p-4 text-sm'>
                    <span className='px-3 py-1 rounded-full text-sm  bg-yellow-500/30 text-yellow-300'>
                      {vendor?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4 text-center'>
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className='px-4 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-md cursor-pointer text-nowrap'
                    >
                      Check Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile card  */}
      <div className='md:hidden flex flex-col gap-6'>
        {ApprovedVendors.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>
            No Approved Vendor Found
          </div>
        ) : (
          ApprovedVendors.map((vendor, index) => (
            <div
              key={index}
              className='bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 space-y-2 transition'
            >
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>{vendor?.name}</h3>
                <span className='px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300'>
                  {vendor?.gstNumber}
                </span>
              </div>
              <p className='text-sm text-gray-300'>
                <b>Shop Name:</b> {vendor?.shopName}
              </p>
              <p className='text-sm text-gray-300'>
                <b>Shop Address:</b> {vendor?.shopAddress}
              </p>
              <p className='text-sm text-gray-300'>
                <b>Phone:</b> {vendor?.phone}
              </p>
              <button
                onClick={() => setSelectedVendor(vendor)}
                className='w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded-lg cursor-pointer'
              >
                Vendor Products
              </button>
            </div>
          ))
        )}
      </div>
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className='bg-gray-900 w-full max-w-4xl max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col'
            >
              {/* Header */}
              <div className='flex items-center justify-between p-5 border-b border-white/10'>
                <h3 className='text-lg sm:text-xl font-semibold'>
                  Products of: {selectedVendor.shopName}
                </h3>

                <button
                  onClick={() => setSelectedVendor(null)}
                  className='text-gray-400 hover:text-white'
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className='p-5 overflow-y-auto'>
                {selectedVendor.vendorProducts?.length ? (
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {selectedVendor.vendorProducts.map((p: any, i: number) => (
                      <div
                        key={i}
                        className='bg-white/5 hover:bg-white/10 transition border border-white/10 rounded-xl p-3'
                      >
                        {/* Image */}
                        <div className='w-full h-32 bg-white/10 rounded-lg mb-3 overflow-hidden'>
                          <img
                            src={p.images?.[0]}
                            alt={p.title}
                            className='w-full h-full object-cover'
                          />
                        </div>

                        {/* Title */}
                        <h4 className='font-semibold text-sm line-clamp-2'>
                          {p.title}
                        </h4>

                        
                      
                        <div className='flex  gap-1'>
                          <span className='text-gray-300 line-clamp-2 text-sm'>
                             {p.description}
                          </span>
                          
                        </div>
                        <div className='flex  gap-1'>
                          <span className='text-gray-400 text-sm'>
                            Category: {p.category}
                          </span>
                          
                        </div>
                        <div className='flex items-center justify-between mt-2'>
                          <span className='text-green-400 font-bold'>
                            ৳ {p.price}
                          </span>

                          <span className='text-xs text-gray-400'>
                            Stock: {p.stock}
                          </span>
                        </div>
                        <div className='flex items-center justify-between mt-2'>
                          <span className='text-green-200 font-bold'>
                            {p.isActive? "Active":"InActive"}
                          </span>

                         <span
                            className={`
                            px-2 py-1
                            rounded-full
                            text-xs
                            font-semibold
                            capitalize
                            w-fit
                            ${productStatusConfig[p.verificationStatus]}
                          `}
                          >
                            {p.verificationStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-center text-gray-400 py-10'>
                    No Product Found
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className='p-4 border-t border-white/10 flex justify-end'>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className='px-4 bg-red-400 hover:bg-red-500 transition py-2 rounded-lg font-semibold'
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
