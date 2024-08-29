'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Navbar from './Navbar'

const Navigation = () => {
  const pathname = usePathname()

  const getTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'Home'
      case '/gallery':
        return 'Gallery'
      case '/posts':
        return 'Posts'
      case '/about':
        return 'About'
      case '/calendar':
        return 'Calendar'
      default:
        return 'Page'
    }
  }

  const title = getTitle(pathname)

  return <Navbar title={title} />
}

export default Navigation
