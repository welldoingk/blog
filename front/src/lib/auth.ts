export const setRefreshToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token)
  }
}

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken')
  }
  return null
}

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }
}

export const setToken = (accessToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', accessToken)
  }
}

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}
export const removeRefreshToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
}
