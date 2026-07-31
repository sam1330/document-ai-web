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
import { useCredits } from '@/contexts/CreditContext'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'

export default function ResumeBuilderEditPage() {
  const { id } = useParams()
  const { setData } = useResumeStore()
  const { getBalance } = useCredits()
  const [loading, setLoading] = useState(true)
  const [needsConversion, setNeedsConversion] = useState(false)
  const [converting, setConverting] = useState(false)
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
          setNeedsConversion(false)
        } else {
          setNeedsConversion(true)
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

  const handleConvert = async () => {
    setConverting(true)
    try {
      const res = await api.post(`/api/resumes/${id}/convert`)
      setData({
        original_filename: res.data.resume.original_filename,
        ...res.data.resume.metadata,
      })
      getBalance()
      setNeedsConversion(false)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.response?.data?.error || t('resumes.builder.convert.failed'),
      )
    } finally {
      setConverting(false)
    }
  }

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

  if (needsConversion) {
    return (
      <ProtectedRoute>
        <div className="h-screen flex flex-col bg-white">
          <Navigation />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-5">
              <div className="h-14 w-14 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center">
                <PencilSquareIcon className="h-7 w-7 text-indigo-600" />
              </div>
              <h1 className="text-xl font-black text-slate-900">{t('resumes.builder.convert.title')}</h1>
              <p className="text-slate-500">{t('resumes.builder.convert.subtitle')}</p>
              <Button onClick={handleConvert} loading={converting} className="mx-auto px-6 py-3 font-bold rounded-xl">
                {t('resumes.builder.convert.button')}
              </Button>
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
