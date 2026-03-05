"use client";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineShop, AiOutlineTool, AiOutlineUser } from "react-icons/ai";
import { TbPlayerTrackNext } from "react-icons/tb";
import { ClipLoader } from "react-spinners";

export default function EditRoledAndPhone() {
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [adminExist, setAdminExist] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const roles = [
    { label: "Admin", value: "admin", icon: <AiOutlineTool size={40} /> },
    { label: "Vendor", value: "vendor", icon: <AiOutlineShop size={40} /> },
    { label: "User", value: "user", icon: <AiOutlineUser size={40} /> },
  ];
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/admin/check-admin");
        setAdminExist(res.data.exists);
      } catch (error) {
        setAdminExist(false);
        console.log(error);
      }
    };
    checkAdmin();
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!role || !phone) {
      alert("please select the role and enter the phone number");
    }
    try {
      const result = await axios.post("/api/user/edit-role-phone", {
        role,
        phone
      });
      console.log(result.data);
      setLoading(false);
      router.push("/")
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to to-gray-900 text-white p-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg text-center bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/10 "
        >
          <h1 className="text-4xl  text-center mb-4 ">Choose Your Role</h1>
          <p className="text-center text-gray-300 mb-8 text-base">
            Select Your Role and Enter Your Mobile Number To Continue.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="text"
              required
              placeholder="Enter Your Mobile Number"
              maxLength={11}
              className="bg-white/10 border border-white/30 rounded-lg p-4 text-lg focus:ring-2 focus:outline-none focus:ring-blue-500"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {roles.map((rol) => {
                const isAdminBlocked = rol.value == "admin" && adminExist;
                return (
                  <motion.div
                    key={rol.value}
                    onClick={() => {
                      if (isAdminBlocked) {
                        alert(
                          "Amin already exists. You can't select admin role.",
                        );
                        return;
                      }
                      setRole(rol.value);
                    }}
                    whileHover={!isAdminBlocked ? { scale: 1.07 } : {}}
                    className={` cursor-pointer p-6 text-center rounded-2xl border transition text-lg font-medium ${role === rol.value ? "border-blue-500 bg-blue-500/40" : "border-white/20 bg-white/10 hover:bg-white/20"} ${isAdminBlocked && "opacity-40 cursor-not-allowed"}`}
                  >
                    <div className="flex justify-center mb-6">{rol.icon}</div>
                    <p>{rol.label}</p>
                    {isAdminBlocked && (
                      <p className="text-sm text-red-400 mt-2">
                        Admin Already Exists
                      </p>
                    )}
                  </motion.div>
                );
              })}
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
