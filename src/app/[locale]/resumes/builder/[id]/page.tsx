"use client"

import React, { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import ResumeBuilder from '@/components/resume/ResumeBuilder'
import { useResumeStore } from '@/lib/store/useResumeStore'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import Navigation from '@/components/Navigation'

export default function ResumeBuilderEditPage() {
  const { id } = useParams()
  const { setData } = useResumeStore()
  const [loading, setLoading] = useState(true)
  const t = useTranslations()

  useEffect(() => {
    const fetchResume = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/api/resumes/${id}`)
        // The API returns { resume: { ... }, latest_analysis: { ... } }
        const resumeData = response.data.resume

        if (resumeData && resumeData.metadata) {
          setData({
            original_filename: resumeData.original_filename,
            ...resumeData.metadata
          })
        } else {
          toast.error(t('resumes.builder.toasts.invalidData'))
        }
      } catch (error) {
        console.error('Failed to fetch resume:', error)
        toast.error(t('resumes.builder.toasts.loadFailed'))
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchResume()
    }
  }, [id, setData, t])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="h-screen flex flex-col bg-white">
          <Navigation />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="text-slate-500 font-medium animate-pulse">{t('resumes.builder.toasts.loadingResume')}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <ResumeBuilder resumeId={id as string} />
    </ProtectedRoute>
  )
}
