import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./userSlice"
import vendorSlice from "./vendorSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    vendors: vendorSlice

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch