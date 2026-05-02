'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthResponse } from '@/types'
import api from '@/lib/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, recaptcha_token?: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  verifyEmail: (token: string) => Promise<AuthResponse>
  resendVerification: (email: string) => Promise<void>
  checkVerificationStatus: (email: string) => Promise<VerificationStatusResponse>
  requestPasswordReset: (email: string, recaptcha_token?: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  recaptcha_token?: string
}

interface VerificationStatusResponse {
  email: string
  email_verified: boolean
  first_name: string
  last_name: string
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile')
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string, recaptcha_token?: string) => {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      email,
      password,
      recaptcha_token,
    })

    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
  }

  const register = async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/api/auth/register', data)

    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = () => {
    const response = api.post('/api/auth/logout');

    response.then(() => {
      localStorage.removeItem('token')
      setUser(null)
    });
  }

  const updateProfile = async (data: Partial<User>) => {
    const response = await api.put('/api/auth/profile', data)
    setUser(response.data)
  }

  const verifyEmail = async (token: string) => {
    const response = await api.post<AuthResponse>('/api/auth/verify-email', { token })
    const { token: authToken, user } = response.data
    if (authToken) {
      localStorage.setItem('token', authToken)
      setUser(user)
    }
    return response.data
  }

  const resendVerification = async (email: string) => {
    await api.post('/api/auth/resend-verification', { email })
  }

  const checkVerificationStatus = async (email: string) => {
    const response = await api.get<VerificationStatusResponse>('/api/auth/verify-email/status', {
      params: { email }
    })
    return response.data
  }

  const requestPasswordReset = async (email: string, recaptcha_token?: string) => {
    await api.post('/api/auth/forgot-password', { email, recaptcha_token })
  }

  const resetPassword = async (token: string, newPassword: string) => {
    await api.post('/api/auth/reset-password', { token, password: newPassword })
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      verifyEmail,
      resendVerification,
      checkVerificationStatus,
      requestPasswordReset,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
