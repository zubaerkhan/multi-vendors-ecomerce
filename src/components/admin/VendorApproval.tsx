'use client'

import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorSlice'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

export default function VendorApproval() {
  UseGetAllVendors()
  const dispatch = useDispatch<AppDispatch>()
  const AllVendorsData: IUser[] = useSelector(
    (state: RootState) => state.vendors.allVendorsData,
  )
  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [rejectModel, setRejectModel] = useState(false)
  const [rejectedReason, setRejectedReason] = useState('')
  const openReajectReasonArea = () => {
    setRejectModel(true)
    setRejectedReason('')
  }
  const handleAproved = async () => {
    setLoading(true)
    if (!selectedVendor) return
    try {
      await axios.post('/api/admin/update-vendor-status', {
        vendorId: selectedVendor._id,
        status: 'approved',
      })
      const updatedVendor = AllVendorsData.filter(
        (v) => v._id !== selectedVendor._id,
      )
      dispatch(setAllVendorsData(updatedVendor))
      setSelectedVendor(null)
      setLoading(false)
      alert('Vendor approved')
    } catch (error) {
      console.log(error)
      setLoading(false)
      alert('Vendor approval failed')
    }
  }
  const handleRejected = async () => {
    setLoading(true)
    if (!selectedVendor) return
    if (rejectedReason == "") {
      alert('Type rejected reason')
      setLoading(false)
      return
    }
    try {
      await axios.post('/api/admin/update-vendor-status', {
        vendorId: selectedVendor._id,
        status: 'rejected',
        rejectedReason,
      })
      const updatedVendor = AllVendorsData.filter(
        (v) => v._id !== selectedVendor._id,
      )
      dispatch(setAllVendorsData(updatedVendor))
      setSelectedVendor(null)
      setLoading(false)
      alert('Vendor Rejected')
    } catch (error) {
      console.log(error)
      setLoading(false)
      alert('Vendor rejection failed')
    }
  }

  const pendingVendors = Array.isArray(AllVendorsData)
    ? AllVendorsData.filter((v) => v.verificationStatus === 'pending')
    : []

  return (
    <div className='w-full px-3 py-10 sm:px-6 lg:px-1 text-white'>
      <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold mb-6'>
        Vendor Approval Requestes
      </h1>
      {/* desktop table  */}
      <div className='hidden md:block overflow-x-auto bg-white/5 rounded-xl border border-white/10'>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='p-4'>Vendor Name</th>
              <th className='p-4'>Shop Name</th>
              <th className='p-4'> Phone</th>
              <th className='p-4'>Status</th>
              <th className='p-4 text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-6 text-center text-gray-400'>
                  No Vendors Approval request Found
                </td>
              </tr>
            ) : (
              pendingVendors.map((vendor, index) => (
                <tr
                  key={index}
                  className='border-t border-white/10 hover:bg-white/5'
                >
                  <td className='p-4'>{vendor?.name}</td>
                  <td className='p-4'>{vendor?.shopName || '-'}</td>
                  <td className='p-4'>{vendor?.phone || '-'}</td>
                  <td className='p-4'>
                    <span className='px-3 py-1 rounded-full text-sm  bg-yellow-500/30 text-yellow-300'>
                      {vendor?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-4 text-center'>
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className='px-4 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-md cursor-pointer'
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
        {pendingVendors.length === 0 ? (
          <div className='text-center text-gray-400 mt-10'>
            No Vendor Approver Request Found
          </div>
        ) : (
          pendingVendors.map((vendor, index) => (
            <div
              key={index}
              className='bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl p-4 space-y-2 transition'
            >
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>{vendor?.name}</h3>
                <span className='px-3 py-1 rounded-full text-xs bg-yellow-500/30 text-yellow-300'>
                  {vendor?.verificationStatus}
                </span>
              </div>
              <p className='text-sm text-gray-300'>
                <b>Shop:</b> {vendor?.shopName}
              </p>
              <p className='text-sm text-gray-300'>
                <b>Phone:</b> {vendor?.phone}
              </p>
              <button
                onClick={() => setSelectedVendor(vendor)}
                className='w-full bg-blue-600 hover:bg-blue-700 text-sm py-2 rounded-lg cursor-pointer'
              >
                Check Details
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
            className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4'
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className='bg-gray-900 p-6 rounded-2xl w-full max-w-lg border border-white/10'
            >
              <h3 className='text-xl sm:text-2xl font-bold mb-4'>
                Selected Vendor Details
              </h3>
              <div className='space-y-2 text-sm '>
                <p>
                  <b>Name:</b> {selectedVendor?.name}
                </p>
                <p>
                  <b>Email: </b>
                  {selectedVendor?.email}
                </p>
                <p>
                  <b>Phone:</b> {selectedVendor?.phone}
                </p>
                <p>
                  <b>Shop Name: </b>
                  {selectedVendor?.shopName}
                </p>
                <p>
                  <b>Shop Address:</b> {selectedVendor?.shopAddress}
                </p>
                <p>
                  <b>GSTN:</b> {selectedVendor?.gstNumber}
                </p>
              </div>
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
                  onClick={() => setSelectedVendor(null)}
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
