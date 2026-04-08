'use client'

import Navbar from '@/components/Navbar'
import ProductCard from '@/components/ProductCard'
import { RootState } from '@/redux/store'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export default function CategoriesPage() {
  const categories = [
    { label: 'all', icon: '📁' },
    { label: 'Fashion & Lifestyle', icon: '👗' },
    { label: 'Electronics & Gadgets', icon: '📱' },
    { label: 'Home & Living', icon: '🏠' },
    { label: 'Beauty & Personal Care', icon: '💄' },
    { label: 'Toys, Kids & Baby', icon: '🧸' },
    { label: 'Food & Grocery', icon: '🛒' },
    { label: 'Sports & Fitness', icon: '🏀' },
    { label: 'Automotive Accessories', icon: '🚗' },
    { label: 'Gifts & Handcrafts', icon: '🎁' },
    { label: 'Books & Stationery', icon: '📚' },
  ]
  const { allVendorsData } = useSelector((state: RootState) => state.vendors)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedShop, setSelectedShop] = useState('all')
  const [shopSearch, setShopSearch] = useState('')
  const [displayProducts, setDispayProducts] = useState<any[]>([])
  const [ready, setReady] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      setSelectedCategory(cat.trim())
    }
    setReady(true)
  }, [searchParams])

  const fetchProducts = async function () {
    try {
      const param = new URLSearchParams()
      if (search) param.append('query', search)
      if (selectedCategory !== 'all') {
        param.append('category', selectedCategory)
      }
      if (selectedShop !== 'all') {
        param.append('shop', selectedShop)
      }

      const result = await axios.get(`/api/search?${param.toString()}`)
      console.log(result.data.products)

      setDispayProducts(result.data.products)
    } catch (error: any) {
      alert(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    if (!ready) return
    fetchProducts()
  }, [selectedCategory, search, selectedShop, ready])
  const shopsFilter = !shopSearch
    ? []
    : allVendorsData.filter((v: any) =>
        v.shopName.toLowerCase().includes(shopSearch.toLowerCase()),
      )

  return (
    <div className='min-h-screen  bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 p-6 text-white px-4 py-12 pt-20 '>
      <Navbar />
      <div className='max-w-7xl mx-auto mb-6'>
        <h1 className='text-2xl sm:text-3xl font-bold'>
          Search Products by Categories
        </h1>
        <p className='text-gray-300 text-sm'>
          Filter by Category, Shop or search your favorite.
        </p>
      </div>
      {/* Breadcrumb */}
      <nav className='text-gray-400 text-sm mb-2' aria-label='breadcrumb'>
        <ol className='list-reset flex'>
          <li>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedShop('all')
                setShopSearch('')
              }}
              className='hover:underline'
            >
              Clear Filter
            </button>
          </li>
          {search && (
            <>
              <li>
                <span className='mx-2'>/</span>
              </li>
              <li>Search Product: {search || ''}</li>
            </>
          )}
          {selectedCategory !== 'all' && (
            <>
              <li>
                <span className='mx-2'>/</span>
              </li>
              <li>Selected Category: {selectedCategory}</li>
            </>
          )}
          {selectedShop !== 'all' && (
            <>
              <li>
                <span className='mx-2'>/</span>
              </li>
              <li>Selected shop: {shopSearch || ''}</li>
            </>
          )}
        </ol>
      </nav>
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4'>
        {/* left sidebar */}

        <div className='md:col-span-1  bg-white/10 border-white/20 rounded-xl p-4 space-y-6'>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type='text'
            placeholder='Search Product...'
            className='w-full  px-3 py-2 rounded bg-black border border-white/20'
          />
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {categories.map((cat) => (
              <button
                onClick={() => {
                  setSelectedCategory(cat.label)
                }}
                key={cat.label}
                className={`w-full flex gap-2 px-3 py-2 rounded ${selectedCategory === cat.label ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <div className='relative'>
            <input
              onChange={(e) => {
                setShopSearch(e.target.value)
                setSelectedShop('all')
              }}
              value={shopSearch}
              type='text'
              placeholder='Search Shop...'
              className='w-full px-3 py-2 rounded bg-black border border-white/20'
            />

            {/* Selected shop chip */}
            {selectedShop !== 'all' && (
              <div className='mt-2 flex items-center justify-between bg-blue-600/20 px-2 py-1 rounded'>
                <span className='text-sm truncate'>
                  Selected shop: {shopSearch}
                </span>
                <button
                  onClick={() => {
                    setSelectedShop('all')
                    setShopSearch('')
                  }}
                  className='text-xs bg-red-500 px-2 py-0.5 rounded'
                >
                  ✕
                </button>
              </div>
            )}

            {/* Dropdown */}
            {shopSearch && selectedShop === 'all' && (
              <div className='absolute z-50 w-full mt-1 bg-black border border-white/20 rounded shadow-lg max-h-48 overflow-y-auto'>
                {shopsFilter.length === 0 ? (
                  <div className='px-3 py-2 text-gray-400 text-sm'>
                    No shop found
                  </div>
                ) : (
                  shopsFilter.map((shop: any) => (
                    <button
                      key={shop._id}
                      onClick={() => {
                        setSelectedShop(shop._id)
                        setShopSearch(shop.shopName)
                      }}
                      className='w-full text-left px-3 py-2 hover:bg-white/10 text-sm'
                    >
                      {shop.shopName}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div className='md:col-span-3'>
          {displayProducts.length === 0 ? (
            <div className='text-center mt-20 text-gray-400'>
              No product found
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5'>
              {displayProducts.map((p: any) => (
                <ProductCard product={p} key={p._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
