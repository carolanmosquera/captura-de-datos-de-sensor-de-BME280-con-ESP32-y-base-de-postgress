import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const isAuthenticated = Boolean(token)

  const login = async (email, password) => {
    const data = await authService.login(email, password)

    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    setToken(data.accessToken)
    setUser(data.user)

    return data
  }

  const register = async (payload) => {
    const data = await authService.register(payload)

    localStorage.setItem('token', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))

    setToken(data.accessToken)
    setUser(data.user)

    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    const newUser = { ...user, ...updatedUser }
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateUser,
    }),
    [token, user, isAuthenticated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}