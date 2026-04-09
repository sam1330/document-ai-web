'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthResponse } from '@/types'
import api from '@/lib/api'
import { AxiosResponse } from 'axios'

interface CreditContextType {
  balance: number
  loading: boolean
  getBalance: () => Promise<void>
}

export const CreditContext = createContext<CreditContextType | undefined>(undefined)

export function CreditProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getBalance()
    } else {
      setLoading(false)
    }
  }, [])

  const getBalance = async () => {
    const response: AxiosResponse<{ credits: number }> = await api.get('/api/credits/balance')
    setBalance(response.data.credits)
  }

  return (
    <CreditContext.Provider value={{
      balance,
      loading,
      getBalance,
    }}>
      {children}
    </CreditContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditContext)
  if (context === undefined) {
    throw new Error('useCredits must be used within an AuthProvider')
  }
  return context
}
