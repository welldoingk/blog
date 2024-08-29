'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import FullPageLoading from './FullPageLoading'

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { checkAuth, isLoading } = useAuth()
  const [initialCheck, setInitialCheck] = useState(true)

  useEffect(() => {
    checkAuth()
    setInitialCheck(false)
  }, [checkAuth])

  if (initialCheck || isLoading) {
    return <FullPageLoading />
  }

  return <>{children}</>
}

export default AuthProvider
