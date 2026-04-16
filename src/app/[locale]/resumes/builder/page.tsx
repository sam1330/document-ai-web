"use client"

import React, { useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import ResumeBuilder from '@/components/resume/ResumeBuilder'
import { useResumeStore } from '@/lib/store/useResumeStore'

export default function ResumeBuilderPage() {
  const { resetData } = useResumeStore()

  useEffect(() => {
    resetData()
  }, [resetData])

  return (
    <ProtectedRoute>
      <ResumeBuilder />
    </ProtectedRoute>
  )
}
