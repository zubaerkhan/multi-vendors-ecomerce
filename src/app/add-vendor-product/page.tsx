'use client'

import axios from 'axios'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
  const [images, setImages] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ])
  const [previews, setPreviews] = useState<string[]>(['', '', '', ''])
  // image select handler
  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return

    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)

    const newPreviews = [...previews]
    newPreviews[index] = URL.createObjectURL(file)
    setPreviews(newPreviews)
  }
  // memory leak fix
  useEffect(() => {
    return () => {
      previews.forEach((url) => url && URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev]
      updated[index] = null
      return updated
    })

    setPreviews((prev) => {
      const updated = [...prev]

      // memory free
      if (updated[index]) URL.revokeObjectURL(updated[index])

      updated[index] = ''
      return updated
    })
  }

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
    if (!title || !description || !price || !stock || !category) {
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

    images.forEach((image) => {
      if (image) formData.append('images', image)
    })

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
              checked={freeDelivery}
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
              checked={payOnDelivery}
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
          {previews.map((preview, index) => (
            <div key={index} className=''>
              <input
                type='file'
                hidden
                id={`img${index}`}
                accept='image/*'
                onChange={(e) =>
                  handleImageChange(index, e.target.files?.[0] || null)
                }
              />

              <label
                htmlFor={`img${index}`}
                className='bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20 cursor-pointer relative z-50'
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt={`image ${index + 1}`}
                      className='w-full h-full object-cover rounded'
                    />
                    <AiOutlineClose
                      onClick={(e) => {
                        handleRemoveImage(index)
                      }}
                      size={14}
                      className='absolute top-1 right-1 z-1000'
                    />
                  </>
                ) : (
                  <div className='flex flex-col items-center gap-3 text-xs text-gray-400'>
                    <FiUpload size={22} />
                    <span>Image {index + 1}</span>
                  </div>
                )}
              </label>
            </div>
          ))}
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
