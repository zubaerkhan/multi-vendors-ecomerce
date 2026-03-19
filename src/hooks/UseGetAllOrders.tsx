'use client'
import { AppDispatch } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function UseGetAllOrders() {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const result = await axios.get('/api/order/all-orders', {
          withCredentials: true,
        })
        dispatch(setAllOrdersData(result?.data || []))
      } catch (error) {
        dispatch(setAllOrdersData([]))
      }
    }
    fetchAllOrders()
  }, [])
}
