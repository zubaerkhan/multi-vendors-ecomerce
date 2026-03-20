"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { RiAdminLine } from "react-icons/ri";
import { TbPlayerTrackNext } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { signIn } from "next-auth/react";

export default function Register() {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSingUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      console.log(result);
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      router.push("/login");
      } catch (error: any) {
      alert(error?.response?.data?.message)
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence mode="wait">
        {/* for step 01  */}
        {step == 1 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20 "
          >
            <h1 className="text-4xl font-bold mb-4 text-blue-400">
              Welcome to multivendor
            </h1>
            <p className="text-gray-300 mb-6">
              Reigster with on of the following account types
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "user", icon: <FaUser />, value: "user" },
                { label: "Vendor", icon: <FaShop />, value: "Vendor" },
                { label: "Admin", icon: <RiAdminLine />, value: "Admin" },
              ].map((item) => (
                <motion.div
                  key={item.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-white/5 hover:bg-white/20 cursor-pointer rounded-xl border border-white/30 shadow-lg flex flex-col items-center transition"
                >
                  <span className="text-amber-600 text-4xl mb-2">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.value}</span>
                </motion.div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)}
              className="mt-4 py-3 px-8 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium w-full"
            >
              next <TbPlayerTrackNext />
            </motion.button>
          </motion.div>
        )}

        {/* for step 02  */}
        {step == 2 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            <h1 className="text-2xl font-semibold text-center mb-6 text-blue-300">
              Create your account
            </h1>

            <form onSubmit={handleSingUp} className="flex flex-col gap-4 ">
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                placeholder="Full Name"
                className="bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-blue-500"
              />
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                placeholder="Enter your email"
                className="bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-blue-500"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  placeholder="Enter your password"
                  className="bg-white/10 border border-white/30 rounded-lg p-3 focus:outline-none focus:ring-blue-500 w-full focus:from-fuchsia-900"
                />
                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? (
                    <FaEyeSlash size={22} />
                  ) : (
                    <FaEye size={22} />
                  )}
                </button>
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
                    {" "}
                    Register now <TbPlayerTrackNext />
                  </>
                )}
              </motion.button>

              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="px-3 text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <motion.button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 py-3  bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="font-medium">Continue with google</span>
              </motion.button>
              <p className="text-center text-sm mt-4 text-gray-400">
                Already have an account{" "}
                <span
                  onClick={() => router.push("/login")}
                  className="text-blue-400 hover:underline hover:text-blue-300 transition cursor-pointer"
                >
                  SignIn
                </span>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
