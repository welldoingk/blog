import { useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './reduxHooks'
import { login, logout } from '@/store/authSlice'
import { decodeToken, getToken } from '@/lib/auth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const checkAuth = useCallback(() => {
    const token = getToken()
    if (token) {
      try {
        const decodedToken = decodeToken(token)
        const currentTime = Date.now() / 1000
        if (decodedToken?.exp && decodedToken?.exp < currentTime) {
          // 토큰이 만료된 경우
          dispatch(logout())
        } else {
          dispatch(login({ username: decodedToken?.sub as string }))
        }
      } catch (error) {
        console.error('Failed to decode token:', error)
        dispatch(logout())
      }
    } else {
      dispatch(logout())
    }
  }, [dispatch])

  useEffect(() => {
    checkAuth()
    // 주기적으로 토큰 유효성 체크 (예: 1분마다)
    const intervalId = setInterval(checkAuth, 60000)
    return () => clearInterval(intervalId)
  }, [checkAuth])

  return { isAuthenticated, user, checkAuth }
}
