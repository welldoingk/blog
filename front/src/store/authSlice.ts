import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { removeToken } from '@/lib/auth'

interface User {
  username: string
}

interface AuthState {
  isAuthenticated: boolean
  user: null | { username: string }
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true
      state.user = action.payload
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      removeToken() // 로그아웃 시 토큰 제거
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
