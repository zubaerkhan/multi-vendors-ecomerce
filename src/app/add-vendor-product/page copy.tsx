'use client'

import axios from 'axios'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { FiUpload } from 'react-icons/fi'
import { ClipLoader } from 'react-spinners'

export default function AddVendorProduct() {
  const router = useRouter()
  const categories = [
    'Fashion & lifeStyle',
    'Electronics & Gadgets',
    'Home & Living',
    'Beauty & Personal Care',
    'Toys, Kids & Baby',
    'Food & Grocery',
    'Sports & Fitness',
    'Automotive Accessories',
    'Gifts & Handcrafts',
    'Book & Stationery',
    'Others',
  ]
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [stock, setStock] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [isWearable, setIsWearable] = useState(false)
  const [sizes, setSizes] = useState<string[]>([])
  const [replacementDays, setReplacementDays] = useState('')
  const [warranty, setWarranty] = useState('')
  const [freeDelivery, setFreeDelivery] = useState(false)
  const [payOnDelivery, setpayOnDelivery] = useState(false)
  // images
  const [image1, setImage1] = useState<File | null>(null)
  const [image2, setImage2] = useState<File | null>(null)
  const [image3, setImage3] = useState<File | null>(null)
  const [image4, setImage4] = useState<File | null>(null)

  const [imgPreview1, setImgPreview1] = useState<string | null>(null)
  const [imgPreview2, setImgPreview2] = useState<string | null>(null)
  const [imgPreview3, setImgPreview3] = useState<string | null>(null)
  const [imgPreview4, setImgPreview4] = useState<string | null>(null)

  const [detailsPoints, setDetailPoints] = useState<string[]>([])
  const [currentPoint, setCurrentPoint] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }
  const handleAddPoint = () => {
    if (!currentPoint.trim()) {
      alert('Write some point')
      return
    }
    setDetailPoints((prev) => {
      const updated = [...prev, currentPoint]
      return updated
    })
    setCurrentPoint('')
  }

  const handleRemovePoint = (index: number) => {
    setDetailPoints((prev) => prev.filter((_, i) => i !== index))
  }
  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !image1 ||
      !image2 ||
      !image3 ||
      !image4
    ) {
      alert('All Filed and 4 images are required!')
      return
    }
    if (isWearable && sizes.length === 0) {
      alert('Please select at least one size')
      return
    }
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('stock', stock)
    formData.append(
      'category',
      category === 'Others' ? customCategory : category,
    )
    formData.append('isWearable', String(isWearable))
    sizes.forEach((size) => formData.append('sizes', size))
    formData.append('replacementDays', replacementDays)
    formData.append('freeDelivery', String(freeDelivery))
    formData.append('payOnDelivery', String(payOnDelivery))
    formData.append('warranty', warranty)
    detailsPoints.forEach((point) => formData.append('detailsPoints', point))
    if (image1 && image1 && image3 && image4) {
      formData.append('image1', image1)
      formData.append('image2', image2)
      formData.append('image3', image3)
      formData.append('image4', image4)
    }

    try {
      const result = await axios.post('/api/vendor/add-product', formData)
      console.log(result.data)
      setLoading(false)
      alert('✅ Product added successfully. Waiting for admin approval.')
      router.push('/')
    } catch (error) {
      setLoading(false)
      console.log('Add Product error', error)
      alert('❌ Product added Failed.')
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-20 bp-10'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl'
      >
        <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Add New Product</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input
            type='text'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className='p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Product Title'
          />
          <input
            type='Number'
            className='p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Product Price'
            onChange={(e) => setPrice(e.target.value)}
            value={price}
          />
          <input
            type='Number'
            className='p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Stock Quantity'
            onChange={(e) => setStock(e.target.value)}
            value={stock}
          />
          <select
            onChange={(e) => setCategory(e.target.value)}
            className='p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option
              className='bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value=''
            >
              Select Category
            </option>
            {categories.map((category, index) => (
              <option value={category} className='bg-gray-900' key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {category === 'Others' && (
          <input
            onChange={(e) => setCustomCategory(e.target.value)}
            value={customCategory}
            type='text'
            className='mt-4 w-full p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter Custom Category'
          />
        )}
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className='mt-4 w-full p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows={3}
          placeholder='Product Description'
        ></textarea>
        <div className='flex items-center gap-3 mt-5'>
          <input
            onChange={() => setIsWearable(!isWearable)}
            checked={isWearable}
            type='checkbox'
            className='w-5 h-5 focus:outline-none focus:ring-2 focus:ring-blue-500'
            id='wearable'
          />
          <label htmlFor='wearable' className='text-sm'>
            This is a wearable / clothing product
          </label>
        </div>
        {isWearable && (
          <div className='mt-4'>
            <p>Select Sizes</p>
            <div className='flex flex-wrap gap-3 mt-2'>
              {sizeOptions.map((size) => (
                <button
                  onClick={() => toggleSize(size)}
                  key={size}
                  type='button'
                  className={`px-4 py-1 rounded-full border ${sizes.includes(size) ? 'bg-blue-600 border-blue-500' : 'bg-white/10 border-white/20'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
          <input
            type='text'
            className='p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='ReplacementDays (e.g. 7 days)'
            onChange={(e) => setReplacementDays(e.target.value)}
            value={replacementDays}
          />
          <input
            type='text'
            className='p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Warranty (e.g. 1 year)'
            onChange={(e) => setWarranty(e.target.value)}
            value={warranty}
          />
        </div>
        <div className='flex items-center  gap-10 mt-5 '>
          <div className='flex gap-2'>
            <input
              onChange={() => setFreeDelivery(!freeDelivery)}
              // checked={freeDelivery}
              type='checkbox'
              className='w-5 h-5 focus:outline-none focus:ring-2 focus:ring-blue-500'
              id='freeDelivery'
            />
            <label htmlFor='freeDelivery' className='text-sm'>
              Free Delivery
            </label>
          </div>
          <div className='flex gap-2'>
            <input
              onChange={() => setpayOnDelivery(!payOnDelivery)}
              // checked={payOnDelivery}
              type='checkbox'
              className='w-5 h-5 focus:outline-none focus:ring-2 focus:ring-blue-500'
              id='payOnDelivery'
            />
            <label htmlFor='payOnDelivery' className='text-sm'>
              Pay On Delivery
            </label>
          </div>
        </div>
        <h3 className='mt-6 mb-3 font-semibold'>Upload 4 Images</h3>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          {/* image1  */}
          <div>
            <input
              type='file'
              hidden
              id='img1'
              accept='image/*'
              className=''
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImage1(file)
                setImgPreview1(URL.createObjectURL(file))
              }}
            />
            <label
              htmlFor='img1'
              className='bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 cursor-pointer hover:border-blue-500 transition relative'
            >
              {imgPreview1 ? (
                <>
                  <Image
                    src={imgPreview1}
                    alt='image 1'
                    width={120}
                    height={120}
                    className='w-full h-full object-cover rounded'
                  />
                  <AiOutlineClose
                    onClick={() => {
                      setImage1(null)
                      setImgPreview1(null)
                    }}
                    size={12}
                    className='absolute top-1 right-1 bg-gray-900/40 rounded-full'
                  />
                </>
              ) : (
                <div className='flex flex-col items-center  gap-3 text-xs text-gray-400'>
                  <FiUpload size={22} />
                  <span>Image 1</span>
                </div>
              )}
            </label>
          </div>
          {/* image2  */}
          <div>
            <input
              type='file'
              hidden
              id='img2'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImage2(file)
                setImgPreview2(URL.createObjectURL(file))
              }}
            />
            <label
              htmlFor='img2'
              className='bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 cursor-pointer hover:border-blue-500 transition relative'
            >
              {imgPreview2 ? (
                <>
                  <Image
                    src={imgPreview2}
                    alt='image 1'
                    width={120}
                    height={120}
                    className='w-full h-full object-cover rounded '
                  />
                  <AiOutlineClose
                    onClick={() => {
                      setImage2(null)
                      setImgPreview2(null)
                    }}
                    size={12}
                    className='absolute top-1 right-1 bg-gray-900/40 rounded-full'
                  />
                </>
              ) : (
                <div className='flex flex-col items-center  gap-3 text-xs text-gray-400'>
                  <FiUpload size={22} />
                  <span>Image 1</span>
                </div>
              )}
            </label>
          </div>
          {/* image3  */}
          <div>
            <input
              type='file'
              hidden
              id='img3'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImage3(file)
                setImgPreview3(URL.createObjectURL(file))
              }}
            />
            <label
              htmlFor='img3'
              className='bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 cursor-pointer hover:border-blue-500 transition relative'
            >
              {imgPreview3 ? (
                <>
                  <Image
                    src={imgPreview3}
                    alt='image 1'
                    width={120}
                    height={120}
                    className='w-full h-full object-cover rounded '
                  />
                  <AiOutlineClose
                    onClick={() => {
                      setImage3(null)
                      setImgPreview3(null)
                    }}
                    size={12}
                    className='absolute top-1 right-1 bg-gray-900/40 rounded-full'
                  />
                </>
              ) : (
                <div className='flex flex-col items-center  gap-3 text-xs text-gray-400'>
                  <FiUpload size={22} />
                  <span>Image 1</span>
                </div>
              )}
            </label>
          </div>
          {/* image4  */}
          <div>
            <input
              type='file'
              hidden
              id='img4'
              accept='image/*'
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setImage4(file)
                setImgPreview4(URL.createObjectURL(file))
              }}
            />
            <label
              htmlFor='img4'
              className='bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 cursor-pointer hover:border-blue-500 transition relative'
            >
              {imgPreview4 ? (
                <>
                  <Image
                    src={imgPreview4}
                    alt='image 1'
                    width={120}
                    height={120}
                    className='w-full h-full object-cover rounded '
                  />
                  <AiOutlineClose
                    onClick={() => {
                      setImage4(null)
                      setImgPreview4(null)
                    }}
                    size={12}
                    className='absolute top-1 right-1 bg-gray-900/40 rounded-full'
                  />
                </>
              ) : (
                <div className='flex flex-col items-center  gap-3 text-xs text-gray-400'>
                  <FiUpload size={22} />
                  <span>Image 1</span>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className='mt-6'>
          <p className='mb-2 font-semibold'>Product Details Points</p>
          <div className='flex gap-2'>
            <input
              onChange={(e) => setCurrentPoint(e.target.value)}
              value={currentPoint}
              placeholder={`Point ${detailsPoints.length + 1}`}
              type='text'
              className='flex-1 p-3 bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={handleAddPoint}
              className='px-4 bg-blue-600 hover:bg-blue-700 rounded font-semibold cursor-pointer transition'
              type='button'
            >
              Add Point
            </button>
          </div>
          {detailsPoints.length > 0 && (
            <ul className='mt-3 space-y-2'>
              {detailsPoints.map((point, index) => (
                <li
                  key={index}
                  className='flex justify-between items-center bg-white/10 p-2 rounded'
                >
                  <span className='text-sm'>
                    {' '}
                    {index + 1}. {point}
                  </span>
                  <button
                    onClick={() => handleRemovePoint(index)}
                    className='text-sm text-red-400 cursor-pointer'
                    type='button'
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={loading}
          className='w-full mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition cursor-pointer'
        >
          {loading ? <ClipLoader size={24} color='white' /> : 'Add Product'}
        </motion.button>
      </motion.div>
    </div>
  )
}
