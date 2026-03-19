'use client'
import { IUser } from '@/model/user.model'
import VendorDashBoard from './VendorDashBoard'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'

export default function VendorPage({ user }: { user: IUser | null }) {
  
  const [openVerifyForm, setOpenVerifyForm] = useState(false)
  const [shopName, setShopName] = useState(user?.shopName || '')
  const [shopAddress, setShopAddress] = useState(user?.shopAddress || '')
  const [gstNumber, setGstNumber] = useState(user?.gstNumber || '')
const [loading, setLoading] = useState(false)
const router = useRouter()

  const handleVerifyAgain = async()=>{
    if(!shopName || !shopAddress || !gstNumber){
      alert("Fill all fields");
      return;
    }
    setLoading(true)
    try {
      const result = await axios.post("/api/vendor/verifyagain",{shopName, shopAddress, gstNumber})
      console.log(result.data)
      setLoading(false)
      alert("Verification request sent again ✅")
      router.push("/")
     } catch (error: any) {
      alert(error?.response?.data?.message)
      setLoading(false)
    }
  }
  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white'>
        Loading...
      </div>
    )
  }

  const status = user.verificationStatus

  if (status === 'approved') {
    return <VendorDashBoard />
  }

  if (status === 'pending') {
    return (
      <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4'>
        <div className='bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full text-center'>
          <h2 className='text-4xl font-bold mb-6 text-blue-400'>
            Verification Pending ⏳
          </h2>

          <p className='text-gray-200 text-lg leading-relaxed'>
            You can access vendor dashboard only after{' '}
            <span className='font-semibold'>Admin Verification</span>
          </p>

          <div className='mt-6 text-base text-gray-300'>
            Verification Status:{' '}
            <span className='text-yellow-400 capitalize'>{status}</span>
          </div>
          <div className='mt-10 text-sm text-gray-400'>
            It usually takes 2-3 hours to apporved.
          </div>
        </div>
      </div>
    )
  }
  if (status === 'rejected') {
    return (
      <>
        <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4'>
          <div className='bg-white/10 backdrop-blur-md p-12 rounded-2xl shadow-2xl border border-white/30 max-w-2xl w-full text-center'>
            <h2 className='text-4xl font-bold mb-6 text-red-400'>
              Verification Rejected ❌
            </h2>
            <p className='text-gray-200 text-lg leading-relaxed'>
              Your business verification was rejected by{' '}
              <span className='font-semibold'>Admin</span>
            </p>
            <div className='mt-6 text-base text-gray-300'>
              Verification Status:{' '}
              <span className='text-red-500 capitalize'>{status}</span>
            </div>
            <div className='mt-4 text-lg text-red-400'>
              Rejected Reason: {user?.rejectedReason}
            </div>
            {!openVerifyForm ? (
              <button
                onClick={() => setOpenVerifyForm(true)}
                className='bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold mt-4 cursor-pointer'
              >
                Verify Again
              </button>
            ) : (
              <>
                <div className='mt-6 text-left space-y-4'>
                  <input
                    onChange={(e) => setShopName(e.target.value)}
                    value={shopName}
                    className=' w-full p-3 rounded bg-white/10 border border-white/20'
                    placeholder='Shop Name'
                  />
                  <input
                    onChange={(e) => setShopAddress(e.target.value)}
                    value={shopAddress}
                    className=' w-full p-3 rounded bg-white/10 border border-white/20'
                    placeholder='Shop Name'
                  />
                  <input
                    onChange={(e) => setGstNumber(e.target.value)}
                    value={gstNumber}
                    className=' w-full p-3 rounded bg-white/10 border border-white/20'
                    placeholder='Shop Name'
                  />
                </div>
                <button onClick={handleVerifyAgain} disabled={loading} className='w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold mt-3 transition'>{ loading ? <ClipLoader/> : 'Submit & Verify Again'} </button>
                <button onClick={()=>setOpenVerifyForm(false)} className='w-full bg-red-400 hover:bg-red-500 py-3 rounded-lg font-semibold mt-3 transition'>Cancel</button>
              </>
            )}
          </div>
        </div>
      </>
    )
  }
}
