"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import axios from "axios";
import {
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineShop,
} from "react-icons/ai";
import { TbPlayerTrackNext } from "react-icons/tb";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function EditVendorDetails() {
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);
const router = useRouter()
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
     e.preventDefault();
 
    if (!shopName || !shopAddress || !gstNumber) {
      alert("Fill all Field");
      return
    }
    setLoading(true);
    try {
      const result = await axios.post("/api/vendor/edit-details", {
        shopName,
        shopAddress,
        gstNumber,
      });
      console.log(result.data)
      alert("Vendor Shop Details Added Successfully")
      setLoading(false)
      router.push("/")
     } catch (error: any) {
      alert(error?.response?.data?.message)
    }
  };
  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className=" max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/10"
        >
          <h3 className="text-3xl font-semibold text-center mb-4">
            Complete Your Shop Details
          </h3>
          <p className="text-sm text-gray-300 text-center">
            Enter Your Business information to activate your vendor account
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <AiOutlineShop
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                onChange={(e) => setShopName(e.target.value)}
                value={shopName}
                placeholder="Shop name"
                required
                className="w-full bg-white/10 border border-white/10 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <AiOutlineHome
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                onChange={(e) => setShopAddress(e.target.value)}
                value={shopAddress}
                placeholder="Shop Address"
                required
                className="w-full bg-white/10 border border-white/10 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <AiOutlineFileText
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={22}
              />
              <input
                type="text"
                onChange={(e) => setGstNumber(e.target.value)}
                value={gstNumber}
                placeholder="GST Number"
                required
                className="w-full bg-white/10 border border-white/10 rounded-lg p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 py-3 px-8 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium w-full"
            >
              {loading ? (
                <ClipLoader size={20} />
              ) : (
                <>
                  Submit now <TbPlayerTrackNext />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
