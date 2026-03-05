import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";
import { createSlice } from "@reduxjs/toolkit";

interface IUserData {
    allVendorsData : IUser[];
    allProductsData : IProduct[]
}

const initialState : IUserData={
    allVendorsData : [],
    allProductsData: []

}

const VendorSlice = createSlice({
    name:"Vendor",
    initialState,
    reducers:{
        setAllVendorsData:(state,action)=>{
            state.allVendorsData = action.payload
        },
        setAllProductsData: (state, action)=>{
            state.allProductsData = action.payload
        }
    }
})
export const {setAllVendorsData, setAllProductsData} = VendorSlice.actions
export default VendorSlice.reducer