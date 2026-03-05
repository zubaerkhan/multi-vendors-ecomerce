'use client'

import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setUserData } from '@/redux/userSlice'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

export default function Profile() {
  UseGetCurrentUser()
  const user = useSelector((state: RootState) => state.user.userData)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditShop, setShowEditShop] = useState(false)
  const [previewImage, setPreviewImage] = useState(user?.image)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [userName, setUserName] = useState(user?.name || '')
  const [userPhone, setUserPhone] = useState(user?.phone || '')
  const [shopName, setShopName] = useState(user?.shopName)
  const [shopAddress, setShopAddress] = useState(user?.shopAddress || '')
  const [gstNumber, setGSTNumber] = useState(user?.gstNumber || '')
  const [loading, setLoading] = useState(false)
  
  const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setProfileImage(file)
    setPreviewImage(URL.createObjectURL(file))
  }
  const handleVerifyAgain = async () => {
    if (!shopName || !shopAddress || !gstNumber) {
      alert('Fill all fields')
      return
    }
    setLoading(true)
    try {
      const result = await axios.post('/api/vendor/verifyagain', {
        shopName,
        shopAddress,
        gstNumber,
      })
      console.log(result.data)
      setLoading(false)
      alert('Shop Details updated ✅')
      router.push('/')
    } catch (error) {
      setLoading(false)
      alert('Shop Details updated ❌')
    }
  }
  const handleUpdateProfile = async () => {
    const formData = new FormData()
    formData.append('name', userName)
    formData.append('phone', userPhone)
    if (profileImage) {
      formData.append('image', profileImage)
    }
    setLoading(true)
    try {
      const result = await axios.post('/api/user/update-profile',  formData )
      dispatch(setUserData(result.data))
      console.log(result.data)
      setLoading(false)
      setProfileImage(null)

      alert('Profile updated successfully')
      router.back()
    } catch (error) {
      setLoading(false)
      console.log(error)
      alert('Profile updated error ❌')
    }
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-24 pb-10'>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className='max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-2xl border-2 border-white/20 shadow-lg'
      >
        <div className='flex flex-col items-center text-center'>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className='w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/30 hover:border-blue-400 transition bg-gray-700'
          >
            {previewImage ? (
              <Image
                src={previewImage}
                width={120}
                height={120}
                alt='selected Image'
                className='object-cover w-full h-full'
              />
            ) : (
              <div className='flex items-center justify-center w-full h-full'>
                <AiOutlineUser size={60} />
              </div>
            )}
          </motion.div>
          <h2 className='text-2xl sm:text-3xl font-bold mt-4'>{user?.name}</h2>
          <p className='text-gray-300 sm:text-base'>{user?.email}</p>
          <p className='text-gray-400 sm:text-sm mt-1'>
            Role: <span className='text-blue-400 uppercase'>{user?.role}</span>
          </p>
        </div>
        <div className='t-5 space-y-3 text-sm sm:text-base'>
          <p>
            <b>Phone:</b> {user?.phone || '-'}
          </p>
          {user?.role == 'vendor' && (
            <>
              <p>
                <b>Shop Name:</b> {user?.shopName || '-'}
              </p>
              <p>
                <b>Shop Address:</b> {user?.shopAddress || '-'}
              </p>
              <p>
                <b>GST Number:</b> {user?.gstNumber || '-'}
              </p>
            </>
          )}
        </div>
        <div className='grid grid-cols-1 gap-4 mt-8'>
          {user?.role == 'user' && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => router.push('/orders')}
              className='bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold overflow-hidden transition text-center'
            >
              My Order
            </motion.div>
          )}
          <motion.button
            whileHover={{ scale: 1.01 }}
            onClick={() => {
              setShowEditProfile(!showEditProfile)
              setShowEditShop(false)
            }}
            className={`${showEditProfile ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-700 py-3 rounded-lg font-semibold overflow-hidden transition text-center w-full `}
          >
            Edit Profile
          </motion.button>
          {user?.role == 'vendor' && (
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => {
                setShowEditShop(!showEditShop)
                setShowEditProfile(false)
              }}
              className={`${showEditShop ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-700 py-3 rounded-lg font-semibold overflow-hidden transition text-center w-full mx-auto`}
            >
              Edit Shop Details
            </motion.button>
          )}
        </div>
        <AnimatePresence>
          {showEditProfile && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className='mt-10 max-w-lg mx-auto bg-white/5 p-5 sm:p-5 rounded-xl border border-white/20'
            >
              <h3 className='font-semibold text-xl'>Edit Profile</h3>
              <div className='flex flex-col gap-3 items-center justify-center'>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className='w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-3 hover:border-blue-400 transition bg-gray-700 '
                >
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      width={120}
                      height={120}
                      alt='selected Image'
                      className='object-cover w-full h-full'
                    />
                  ) : (
                    <div className='flex items-center justify-center w-full h-full'>
                      <AiOutlineUser size={60} />
                    </div>
                  )}
                </motion.div>
                <label className='cursor-pointer bg-blue-600 px-4 py-2 rounded-lg text-sm'>
                  <input
                    onChange={handlePreviewImage}
                    type='file'
                    hidden
                    accept='image/*'
                  />
                  Select Image
                </label>
              </div>
              <div className='space-y-4 mt-4'>
                <input
                  type='text'
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  placeholder='Full name'
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-md'
                />
                <input
                  type='text'
                  onChange={(e) => setUserPhone(e.target.value)}
                  value={userPhone}
                  placeholder='Your phone number'
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-md'
                />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className='bg-blue-600 w-full hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold overflow-hidden transition text-center'
                >
                    {loading ? <ClipLoader size={20} /> : 'Update Profile'}
                 
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showEditShop && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className='mt-10 max-w-lg mx-auto bg-white/5 p-5 sm:p-5 rounded-xl border border-white/20'
            >
              <h3 className='font-semibold text-xl'>Edit Shop Detail</h3>
              <div className='space-y-4 mt-4'>
                <input
                  type='text'
                  onChange={(e) => setShopName(e.target.value)}
                  value={shopName}
                  placeholder='Full name'
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-md'
                />
                <input
                  type='text'
                  onChange={(e) => setShopAddress(e.target.value)}
                  value={shopAddress}
                  placeholder='Enter phone number'
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-md'
                />
                <input
                  type='text'
                  onChange={(e) => setGSTNumber(e.target.value)}
                  value={gstNumber}
                  placeholder='Enter GST Number'
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-md'
                />
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={handleVerifyAgain}
                  disabled={loading}
                  className='bg-blue-600 w-full hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold overflow-hidden transition text-center'
                >
                  {loading ? <ClipLoader size={20} /> : ' Update Shop Details'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
