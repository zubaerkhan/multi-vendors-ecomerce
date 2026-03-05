'use client'

import ProductCard from '@/components/ProductCard'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiOutlineClose, AiOutlineLoading } from 'react-icons/ai'
import { FaRegStar, FaStar, FaUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import { useRef } from 'react'
import { setUserData } from '@/redux/userSlice'

export default function page() {
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const { allProductsData } = useSelector((state: RootState) => state.vendors)
  const [activeImage, setActiveImage] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewImage, setReviewImage] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [modalImages, setModalImages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const isDataLoaded = allProductsData && allProductsData.length > 0

  const product = allProductsData?.find(
    (p) => String(p._id) === String(productId) && p.isActive === true,
  )

  const relatedProducts = allProductsData.filter(
    (p) =>
      p.category === product?.category &&
      p._id?.toString() !== product._id?.toString() &&
      p.isActive === true,
  )
  const handleRemoveReviewImage = (index: number) => {
    setReviewImage((prev) => prev.filter((_, i) => i !== index))

    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index]) // memory free
      return prev.filter((_, i) => i !== index)
    })
  }
  // Memory Leak Fix
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewImages])

  const handleSubmitReview = async () => {
    const formData = new FormData()
    formData.append('productId', String(productId))
    formData.append('rating', String(reviewRating))
    formData.append('comment', reviewComment)
    if (reviewImage.length > 6) {
      alert('Max 5 images allowed')
      return
    }

    if (reviewImage) {
      reviewImage.map((img) => formData.append('images', img))
    }

    try {
      setLoading(true)
      const result = await axios.post('/api/vendor/add-review', formData)
      console.log(result.data)

      alert('review add successfully')
      setPreviewImages([])
      setReviewComment('')
      setReviewRating(0)
      setReviewImage([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setLoading(false)
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      console.log(error)
      alert(error?.response?.data?.message || 'Review add error')
    }
  }
  useEffect(() => {
    const handleKey = (e: any) => {
      if (!open) return

      if (e.key === 'ArrowRight')
        setCurrentIndex((i) => (i + 1) % modalImages.length)

      if (e.key === 'ArrowLeft')
        setCurrentIndex((i) => (i === 0 ? modalImages.length - 1 : i - 1))

      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, modalImages])

  const handleAddToCart = async () => {
    try {
      const result = await axios.post('/api/user/cart/add', {
        productId: productId,
        quantity: 1,
      })

      console.log(result.data)
      dispatch(setUserData(result.data.updatedUser))
      alert('Add to cart Successfully')

      router.push('/cart')
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Cart add error')
    }
  }

  if (!isDataLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-black text-white text-4xl'>
        Loading...
      </div>
    )
  }

  const avgRating = product?.reviews?.length
    ? (
        product.reviews.reduce((a, b) => a + b.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : 0

  if (!product) {
    return (
      <div className='min-h-screen flex flex-col gap-2 items-center justify-center bg-black text-white text-4xl'>
        Product not found
        <span
          className='cursor-pointer underline'
          onClick={() => router.push('/')}
        >
          Back to home
        </span>
      </div>
    )
  }

  return (
    <>
      {product && (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10 relative'>
              {/* left top  */}
              <div className='items-start '>
                <div className='relative flex flex-col lg:flex-row gap-4 items-center'>
                  {' '}
                  {/* image thumbnails  */}
                  <div className='flex order-2 lg:order-1 sm:order-2 flex-row lg:flex-col gap-3 items-self-end'>
                    {product?.images.map((image, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`relative w-15 h-15 sm:w-20 sm:h-20 border rounded cursor-pointer bg-black overflow-hidden flex items-center justify-center hover:scale-[110%] transition-all ${activeImage === i ? 'border-blue-600 scale-[110%]' : 'border-white/20'}`}
                      >
                        <Image
                          src={image}
                          alt={product.title}
                          fill
                          className='object-contain p-1 rounded '
                        />
                      </div>
                    ))}
                  </div>
                  {/* main image  */}
                  <div className='lg:order-2 sm:order-1  relative w-full lg:w-[450px] h-[420px] bg-white rounded-lg overflow-hidden flex items-center justify-center border border-white/10'>
                    {product?.images[activeImage] && (
                      <Image
                        src={product?.images[activeImage]}
                        alt={product.title}
                        fill
                        className='object-contain p-1 rounded-md'
                      />
                    )}
                  </div>
                </div>
              </div>
              {/* ritght bottom  */}
              <div>
                <h3 className='text-3xl text-white font-bold mb-3 '>
                  {product?.title}
                </h3>
                <p className='text-gray-400 mb-2'>{product?.category}</p>
                <p className='text-2xl text-green-500 font-bold'>
                  {product?.price} TK
                </p>
                <div className='flex items-center gap-2 mt-1 mb-4'>
                  <div className='flex text-yellow-400 gap-1'>
                    {[1, 2, 3, 4, 5].map((i) =>
                      i <= Math.round(Number(avgRating)) ? (
                        <FaStar key={i} />
                      ) : (
                        <FaRegStar key={i} />
                      ),
                    )}
                  </div>
                  <span className='text-sm text-gray-400'>
                    ({avgRating} / {product?.reviews?.length} ) Reviews
                  </span>
                </div>
                <p
                  className={`text-md  text-gray-300 ${expanded ? '' : 'line-clamp-3'}`}
                >
                  {product?.description}
                </p>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className='text-white pr-2 py-1 underline mb-2'
                >
                  {expanded ? 'Show Less' : 'Read More'}
                </button>

                <p className='mb-3 text-gray-50'>
                  Stock:{' '}
                  <span
                    className={`${product.stock ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.9 }}
                  className='w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold transition text-white '
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </motion.button>
              </div>
            </div>
            <div className='mt-10 bg-white/5 border border-white/10 rounded-lg p-6'>
              {product.isWearable && (
                <div className='mb-5'>
                  <p className='font-semibold mb-2 text-white'>
                    Available Sizes
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {product.sizes?.map((s, i) => (
                      <span
                        key={i}
                        className='px-3 py-1 border bg-white border-white/20 rounded'
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className='space-y-2 mb-6 text-gray-300'>
                {typeof product.replacementDays === 'number' &&
                  product.replacementDays > 0 && (
                    <p>✅{product.replacementDays} Days Replacement</p>
                  )}
                {product.freeDelivery === true && (
                  <p>✅Free Delivery Available</p>
                )}
                {product.payOnDelivery === true && (
                  <p>✅Cash on Delivery Available</p>
                )}
                {product.warranty && product.warranty !== 'No Warranty' && (
                  <p>✅Warranty : {product.warranty}</p>
                )}
              </div>
              {Array.isArray(product.detailsPoints) &&
                product.detailsPoints.length > 0 && (
                  <div className='mb-6 '>
                    <h3 className='font-semibold mb-2 text-white'>
                      Highlights
                    </h3>
                    <ul className='list-disc pl-5 space-y-1 text-gray-300'>
                      {product.detailsPoints.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
            {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
              <div className='mt-12'>
                <h3 className='text-2xl font-bold text-white mb-5'>
                  {' '}
                  Related Products
                </h3>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
                  {relatedProducts.slice(0, 8).map((rp) => (
                    <ProductCard key={rp._id?.toString()} product={rp} />
                  ))}
                </div>
              </div>
            )}
            <div className='mt-10 bg-white/5 border border-white/10 rounded-lg p-6'>
              <h2 className='text-2xl text-white font-bold mb-6  '>
                Customer Reviews
              </h2>
              <div className='mb-8'>
                <p className='text-white font-semibold mb-2'>Add Your Review</p>
                <div className='flex gap-2 mb-2 text-yellow-400'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewRating(i)}
                      key={i}
                      className='cursor-pointer'
                    >
                      {i <= (hoverRating || reviewRating) ? (
                        <FaStar />
                      ) : (
                        <FaRegStar />
                      )}
                    </span>
                  ))}
                </div>
                <textarea
                  onChange={(e) => setReviewComment(e.target.value)}
                  value={reviewComment}
                  placeholder='Write a review...'
                  className='w-full p-3 rounded bg-black text-white border border-white/20'
                  rows={3}
                ></textarea>
                <div className='flex flex-col flex-wrap'>
                  <label
                    className='text-white font-semibold mb-2'
                    htmlFor='reviewImage'
                  >
                    Select Image For Review
                  </label>
                  <input
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])

                      setReviewImage((prev) => [...prev, ...files])

                      const previews = files.map((file) =>
                        URL.createObjectURL(file),
                      )
                      setPreviewImages((prev) => [...prev, ...previews])
                    }}
                    type='file'
                    multiple
                    ref={fileInputRef}
                    accept='image/*'
                    className='mb-3 text-black bg-white  w-70 p-2 rounded'
                    id='reviewImage'
                  />
                  <div className='flex gap-2 flex-wrap mt-3'>
                    {previewImages.map((img, i) => (
                      <div key={i} className='relative'>
                        <Image
                          src={img}
                          alt='Preview'
                          width={100}
                          height={100}
                          className='rounded border'
                        />

                        <AiOutlineClose
                          onClick={() => handleRemoveReviewImage(i)}
                          className='absolute top-1 right-1 bg-gray-900/40 text-white rounded-full'
                          size={20}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSubmitReview}
                  className='px-4 py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded transition mt-5'
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader size={24} color='white' />
                  ) : (
                    'Submit Review'
                  )}
                </motion.button>
              </div>
              {/* reviews shows  */}
              {product?.reviews && product.reviews.length > 0 ? (
                <h2 className=' text-white font-semibold mb-2'>Reviews</h2>
              ) : (
                <h2 className=' text-white font-semibold mb-2'>
                  No Review Found
                </h2>
              )}
              {product?.reviews && product.reviews.length > 0 && (
                <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                  {product.reviews.map((r, i) => (
                    <div
                      key={i}
                      className='bg-white rounded-2xl p-5 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300'
                    >
                      {/* User Info */}
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='w-12 h-12 rounded-full overflow-hidden border'>
                          {r.user?.image ? (
                            <Image
                              src={r.user.image}
                              alt={r.user.name || 'user'}
                              width={48}
                              height={48}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='flex items-center justify-center bg-gray-200 w-full h-full'>
                              <FaUserCircle className='text-3xl text-gray-500' />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className='font-semibold text-black'>
                            {r.user?.name || 'Anonymous'}
                          </p>

                          {/* Rating */}
                          <div className='flex text-yellow-400 text-sm'>
                            {[1, 2, 3, 4, 5].map((n) =>
                              n <= r.rating ? (
                                <FaStar key={n} />
                              ) : (
                                <FaRegStar key={n} />
                              ),
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Comment */}
                      {r.comment && (
                        <p className='text-gray-700 text-sm mb-3 leading-relaxed'>
                          {r.comment}
                        </p>
                      )}

                      {/* Images */}
                      {Array.isArray(r.images) && r.images.length > 0 && (
                        <div className='grid grid-cols-3 gap-2 mt-3'>
                          {r.images.map((img, idx) => (
                            <Image
                              onClick={() => {
                                setModalImages(r.images || [])
                                setCurrentIndex(idx)
                                setOpen(true)
                              }}
                              key={idx}
                              src={img}
                              alt={`review-${idx}`}
                              width={120}
                              height={120}
                              className='rounded-lg object-cover w-full h-24 hover:scale-105 transition cursor-pointer'
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Modal  */}
                  {open && (
                    <div className='fixed inset-0 bg-black/80 flex items-center justify-center z-50'>
                      {/* Close */}
                      <button
                        onClick={() => setOpen(false)}
                        className='absolute top-10 right-10 text-white text-3xl z-1100'
                      >
                        ✖
                      </button>

                      {/* Prev */}
                      <button
                        onClick={() =>
                          setCurrentIndex((prev) =>
                            prev === 0 ? modalImages.length - 1 : prev - 1,
                          )
                        }
                        className='absolute left-15 text-white text-9xl z-1100 cursor-pointer '
                      >
                        ‹
                      </button>

                      {/* Image */}
                      <Image
                        src={modalImages[currentIndex]}
                        alt='zoom'
                        width={600}
                        height={600}
                        className='max-h-[80vh] object-contain rounded-xl'
                      />

                      {/* Next */}
                      <button
                        onClick={() =>
                          setCurrentIndex((prev) =>
                            prev === modalImages.length - 1 ? 0 : prev + 1,
                          )
                        }
                        className='absolute right-15 text-white text-9xl z-1100 cursor-pointer'
                      >
                        ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
