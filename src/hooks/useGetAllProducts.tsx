'use client'
import { AppDispatch } from '@/redux/store'
import { setAllProductsData } from '@/redux/vendorSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function UseGetAllProducts() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const result = await axios.get('/api/vendor/all-products')
        dispatch(setAllProductsData(result.data))
      } catch (error) {
        dispatch(setAllProductsData([]))
      }
    }
    fetchAllProduct()
  }, [])
}
