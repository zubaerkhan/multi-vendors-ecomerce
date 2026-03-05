"use client"
import { AppDispatch } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorSlice'
import axios from 'axios'
import  { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export default function UseGetAllVendors() {
    const dispatch = useDispatch<AppDispatch>()
  useEffect(()=>{
    const fetchAllVendor = async ()=>{
        try {
            const result = await axios.get("/api/vendor/allVendor")
           dispatch(setAllVendorsData(result.data.vendors))
        } catch (error) {
               dispatch(setAllVendorsData([]))
        }
    }
    fetchAllVendor()
  },[])
}
