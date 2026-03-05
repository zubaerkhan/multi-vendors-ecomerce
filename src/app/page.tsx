import { auth } from '@/auth'
import AdminDashBoard from '@/components/admin/AdminDashboard'

import EditRoledAndPhone from '@/components/EditRoledAndPhone'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import UserDashBoard from '@/components/user/UserDashBoard'
import EditVendorDetails from '@/components/vendor/EditVendorDetails'
import VendorPage from '@/components/vendor/VendorPage'
import connectDB from '@/lib/connectDB'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'

export default async function Home() {
  await connectDB()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if (!user) {
    redirect('/login')
  }
  const inComplete =
    !user.role || !user.phone || (!user.phone && user.role == 'user')

  if (inComplete) {
    return <EditRoledAndPhone />
  }
  if (user?.role == 'vendor') {
    const isCompleteDetails =
      !user.shopName || !user.shopAddress || !user.gstNumber
    if (isCompleteDetails) {
      return <EditVendorDetails />
    }
  }

  const plainUser = JSON.parse(JSON.stringify(user))
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to to-gray-900 text-white  font-sans'>
      <Navbar  />
      {user?.role == 'user' ? (
        <UserDashBoard />
      ) : user?.role == 'vendor' ? (
        <>
          <VendorPage user={plainUser} />
        </>
      ) : (
        <AdminDashBoard />
      )}
      <Footer user={plainUser} />
    </div>
  )
}
