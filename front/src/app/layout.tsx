import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '../components/navigation'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Home',
  description: 'Home',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation title={metadata.title} />
        <div className="container mx-auto">{children}</div>
      </body>
    </html>
  )
}
