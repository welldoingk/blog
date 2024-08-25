'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthApi } from '@/lib/api'
import { setTokens } from '@/lib/auth'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { login } from '@/store/authSlice'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { login: loginApi } = useAuthApi()
  const dispatch = useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await loginApi({ username, password })
      setTokens(response.token, response.refreshToken)
      dispatch(login({ username }))
      router.push('/')
    } catch (error) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login
          </h2>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-bold text-blue-500 hover:text-blue-800"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
