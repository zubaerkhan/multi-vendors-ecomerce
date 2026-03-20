"use client";
import { AnimatePresence, motion } from "motion/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { TbPlayerTrackNext } from "react-icons/tb";
import { ClipLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  // 🔥 FIX: only pathname extract
let callbackUrl = searchParams.get("callbackUrl") || "/";

if (callbackUrl.startsWith("http")) {
  callbackUrl = new URL(callbackUrl).pathname;
}

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession()
  

 const handleSingIn = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl, // ✅ এখানে add করো
    });

    if (res?.ok) {
      router.push(callbackUrl); // ✅ এখানে use করো
    } else {
      alert("Invalid credentials");
    }

  } catch (error: any) {
    alert(error?.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
        >
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-100">
            Welcome back to <span className="text-blue-400">Multi vendor</span>
          </h1>

          <form onSubmit={handleSingIn} className="flex flex-col gap-4 ">
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
                {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
              </button>
            </div>
            <motion.button
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="mt-4 py-3 px-8 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium w-full"
            >
              {loading ? (
                <ClipLoader size={20} />
              ) : (
                <>
                  {" "}
                  Login
                  <TbPlayerTrackNext />
                </>
              )}
            </motion.button>

            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="px-3 text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>
            <motion.button
            type="button"
            onClick={()=>signIn("google", {callbackUrl:"/"})}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-3 py-3  bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">Login with google</span>
            </motion.button>
            <p className="text-center text-sm mt-4 text-gray-400">
              Don't have an account?{" "}
              <span
                onClick={() => router.push("/register")}
                className="text-blue-400 hover:underline hover:text-blue-300 transition cursor-pointer"
              >
                SignUp
              </span>
            </p>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
