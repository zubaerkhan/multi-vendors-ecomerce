import type { Metadata } from 'next'

import './globals.css'
import { SessionProvider } from 'next-auth/react'
import Provider from '@/Provider'
import StoreProvider from '@/redux/StoreProvider'
import InitUser from '@/InitUser'

export const metadata: Metadata = {
  title: 'Multi Vendor',
  description: 'multi Vendor Ecomerce Website',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Provider>
          <StoreProvider>
            <InitUser/>
            
            {children}</StoreProvider>
        </Provider>
      </body>
    </html>
  )
}
