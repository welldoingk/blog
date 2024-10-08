import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/header/Header'
import StoreProvider from '@/components/StoreProvider'
import AuthProvider from '@/components/AuthProvider'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | blog',
    default: 'Home | blog',
  },
  description: 'blog description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <AuthProvider>
            <Header />
            <main className="container mx-auto mt-4">{children}</main>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
