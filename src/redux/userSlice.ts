import { IOrder } from '@/model/order.model'
import { IUser } from '@/model/user.model'
import { createSlice } from '@reduxjs/toolkit'

interface IUseData {
  userData: IUser | null
  allOrdersData: IOrder[]
}

const initialState: IUseData = {
  userData: null,
  allOrdersData: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload
    },
    setAllOrdersData: (state, action) => {
      state.allOrdersData = action.payload
    },
  },
})

export const { setUserData, setAllOrdersData } = userSlice.actions
export default userSlice.reducer
