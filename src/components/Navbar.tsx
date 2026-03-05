'use client'
import { IUser } from '@/model/user.model'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logo from '@/assets/logo.png'
import { AnimatePresence, motion } from 'motion/react'
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineHome,
  AiOutlineAppstore,
  AiOutlineLogin,
  AiOutlineLogout,
  AiOutlineSolution,
  AiOutlinePhone,
  AiOutlineShop,
} from 'react-icons/ai'
import { GoListUnordered } from 'react-icons/go'
import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { div } from 'motion/react-client'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

export default function Navbar() {
  UseGetCurrentUser() 
  const user = useSelector((state:RootState)=>state.user.userData)
  const router = useRouter()
  const [openNemu, setOpenMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='fixed top-0 left-0 w-full bg-black text-white z-50 shadow-lg'>
      <div className='max-w-7xl mx-auto px-6 py-3 flex justify-between items-center'>
        {/* logo */}
        <div
          onClick={() => router.push('/')}
          className='flex items-center gap-2 cursor-pointer'
        >
          <Image
            src={logo}
            width={40}
            height={40}
            alt='logo'
            className='rounded-full w-auto h-auto'
          />
          <span className='text-xl font-semibold hidden sm:inline'>
            Multi Vendor
          </span>
        </div>
        {/* Menu  */}
        <div>
          {user?.role == 'user' && (
            <div className='hidden md:flex gap-8'>
              <NavItem label='Home' path='/' router={router} />
              <NavItem label='Categories' path='/category' router={router} />
              <NavItem label='Shop' path='/shop' router={router} />
              <NavItem label='Orders' path='/orders' router={router} />
            </div>
          )}
        </div>
        {/* desktop icons  */}
        <div className='hidden md:flex items-center gap-6'>
          {user?.role == 'user' && (
            <IconBtn
              Icon={AiOutlineSearch}
              onclick={() => router.push('/category')}
            />
          )}
          <IconBtn
            Icon={AiOutlinePhone}
            onclick={() => router.push('/support')}
          />
          <div className='relative z-50'>
            {user?.image ? (
              <Image
                src={user?.image}
                width={40}
                height={40}
                alt='profile'
                onClick={() => setOpenMenu(!openNemu)}
                className='rounded-full w-10 h-10 object-cover border border-gray-700 cursor-pointer '
              />
            ) : (
              <IconBtn
                Icon={AiOutlineUser}
                onClick={() => setOpenMenu(!openNemu)}
              />
            )}
            {/* User profile popup */}
            <AnimatePresence>
              {openNemu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className='absolute right-0 mt-3 w-48  backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c] '
                >
                  <DropDownBtn
                    Icon={AiOutlineUser}
                    label='Profile'
                    onClick={() => {
                      router.push('/profile')
                      setOpenMenu(false)
                    }}
                  />
                  <DropDownBtn
                    Icon={AiOutlineLogin}
                    label='SignIn'
                    onClick={() => {
                      router.push('/login')
                      setOpenMenu(false)
                    }}
                  />
                  <DropDownBtn
                    Icon={AiOutlineLogout}
                    label='SignOut'
                    onClick={() => {
                      signOut()
                      setOpenMenu(false)
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {user?.role == 'user' && (
            <CartBtn
              router={router}
              count={
                user.cart?.reduce((total, c) => total + c.quantity, 0) || 0
              }
            />
          )}
        </div>
        {/* mobile icons  */}
        <div className='md:hidden flex items-center gap-4'>
          {user?.role == 'vendor' || user?.role == 'admin' ? (
            <>
              {/* for vendor and admin  */}
              <IconBtn
                Icon={AiOutlinePhone}
                onclick={() => router.push('/support')}
              />
              <div className='relative'>
                {user?.image ? (
                  <Image
                    src={user?.image}
                    width={32}
                    height={32}
                    alt='profile'
                    onClick={() => setOpenMenu(!openNemu)}
                    className='rounded-full w-8 h-8 object-cover border border-gray-700 cursor-pointer'
                  />
                ) : (
                  <IconBtn
                    Icon={AiOutlineUser}
                    onClick={() => setOpenMenu(!openNemu)}
                  />
                )}
                {/* User profile popup */}
                <AnimatePresence>
                  {openNemu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className='absolute right-0 mt-3 w-48  backdrop-blur-lg rounded-xl shadow-lg border bg-[#6a69693c]'
                    >
                      <DropDownBtn
                        Icon={AiOutlineUser}
                        label='Profile'
                        onClick={() => {
                          router.push('/profile')
                          setOpenMenu(false)
                        }}
                      />
                      <DropDownBtn
                        Icon={AiOutlineLogin}
                        label='SignIn'
                        onClick={() => {
                          router.push('/login')
                          setOpenMenu(false)
                        }}
                      />
                      <DropDownBtn
                        Icon={AiOutlineLogout}
                        label='SignOut'
                        onClick={() => {
                          signOut()
                          setOpenMenu(false)
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              {/* for User  */}
              <IconBtn
                Icon={AiOutlineSearch}
                onclick={() => router.push('/category')}
              />
              <IconBtn
                Icon={AiOutlinePhone}
                onclick={() => router.push('/support')}
              />
              <CartBtn
                router={router}
                count={
                  user?.cart?.reduce((total, c) => total + c.quantity, 0) || 0
                }
              />
              <AiOutlineMenu
                size={28}
                className='cursor-pointer'
                onClick={() => setSidebarOpen(true)}
              />

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                    className='fixed top-0 right-0 h-screen w-[65%] bg-black/90 backdrop-blur-lg text-whtie p-6  '
                  >
                    <div className='flex justify-between items-center mb-6'>
                      <h1 className='text-xl font-semibold'>Menu</h1>
                      <AiOutlineClose
                        size={20}
                        className='cursor-pointer'
                        onClick={() => setSidebarOpen(false)}
                      />
                    </div>
                    {/* sidebar btn  */}
                    <div className='flex flex-col gap-4 text-lg'>
                      <SidebarBtn
                        label='Home'
                        Icon={AiOutlineHome}
                        path={'/'}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label='Categories'
                        Icon={AiOutlineAppstore}
                        path={'/category'}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label='Shops'
                        Icon={AiOutlineShop}
                        path={'/shop'}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label='Orders'
                        Icon={GoListUnordered}
                        path={'/order'}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label='Profile'
                        Icon={AiOutlineUser}
                        path={'/profile'}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtn
                        label='SignIn'
                        Icon={AiOutlineLogin}
                        path={'/signIn'}
                        router={router}
                        setSidebarOpen={setSidebarOpen}
                      />
                      <SidebarBtnForSignOut
                        label='SignOut'
                        Icon={AiOutlineLogout}
                        setSidebarOpen={setSidebarOpen}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
// components
const NavItem = ({ label, path, router }: any) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    onClick={() => router.push(path)}
    className='hover:text-gray-300'
  >
    {label}
  </motion.button>
)

const IconBtn = ({ Icon, onClick }: any) => (
  <motion.button whileHover={{ scale: 1.1 }} onClick={onClick}>
    <Icon size={24} />
  </motion.button>
)

const DropDownBtn = ({ Icon, label, onClick }: any) => (
  <button
    className='flex items-center gap-3 w-full px-4 py-2 hover:bg-white/10 text-left'
    onClick={() => {
      onClick()
    }}
  >
    <Icon size={18} />
    {label}
  </button>
)

const CartBtn = ({ router, count }: any) => (
  <button className='relative' onClick={() => router.push('/cart')}>
    <AiOutlineShoppingCart size={24} />
    {count > 0 && (
      <span className='absolute -top-2 -right-2 bg-blue-500 text-white text-sm rounded-full px-1'>
        {count}
      </span>
    )}
  </button>
)

const SidebarBtn = ({ label, path, router, Icon, setSidebarOpen }: any) => (
  <button
    onClick={() => {
      router.push(path)
      setSidebarOpen(false)
    }}
    className='flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left'
  >
    <Icon size={20} /> {label}
  </button>
)
const SidebarBtnForSignOut = ({ label, Icon, setSidebarOpen }: any) => (
  <button
    onClick={() => {
      signOut()
      setSidebarOpen(false)
    }}
    className='flex items-center gap-3 px-4 py-2 rounded-lg bg-[#6a69693c] hover:bg-white/10 text-left'
  >
    <Icon size={20} /> {label}
  </button>
)
