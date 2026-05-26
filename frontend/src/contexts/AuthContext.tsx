'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('agrivision_token')
    if (savedToken) {
      setToken(savedToken)
      fetchUser(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (t: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setToken(t)
      } else {
        localStorage.removeItem('agrivision_token')
        setToken(null)
        setUser(null)
      }
    } catch {
      localStorage.removeItem('agrivision_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem('agrivision_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem('agrivision_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('agrivision_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
