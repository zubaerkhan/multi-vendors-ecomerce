"use client"

import UseGetAllOrders from "./hooks/UseGetAllOrders";
import UseGetAllProducts from "./hooks/useGetAllProducts";
import UseGetAllVendors from "./hooks/UseGetAllVendors";
import UseGetCurrentUser from "./hooks/UseGetCurrentUser"

export default function InitUser() {
 UseGetCurrentUser()
 UseGetAllVendors()
 UseGetAllProducts()
 UseGetAllOrders()
 return null;
}
