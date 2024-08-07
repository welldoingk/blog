'use client'
import { useState } from 'react'
import Navbar from './navbar'

const Navigation = (props: PostData) => {
  // toggle sidebar
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
  }
  return (
    <>
      <Navbar title={props.title} />
    </>
  )
}

export default Navigation
