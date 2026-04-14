"use client"

import React, { useState } from 'react'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { ResumeForm } from '@/components/resume/ResumeForm'
import { DesignForm } from '@/components/resume/DesignForm'
import { ResumePreview } from '@/components/resume/ResumePreview'
import { Button } from '@/components/ui'
import { useResumeStore } from '@/lib/store/useResumeStore'
import { ArrowDownTrayIcon, ShareIcon, SparklesIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export default function ResumeBuilderPage() {
  const t = useTranslations()
  const { data } = useResumeStore()
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'preview'>('content')
  const [exporting, setExporting] = useState(false)

  const handleDownloadPDF = async () => {
    setExporting(true)
    const toastId = toast.loading('Generating your premium PDF...')

    try {
      // microservice at http://localhost:8000/generate as per requirements
      const response = await axios.post('http://localhost:8000/generate', data, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `haku-resume-${data.cv_body.cv.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Resume downloaded successfully!', { id: toastId })
    } catch (error) {
      console.error('PDF Generation failed:', error)
      toast.error('Failed to generate PDF. Make sure the PDF microservice is running.', { id: toastId })
    } finally {
      setExporting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col overflow-hidden bg-white selection:bg-indigo-100 selection:text-indigo-700">
        <Navigation />

        {/* Top Sticky Toolbar */}
        <div className="h-16 border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center space-x-3 md:space-x-6">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-indigo-600 rounded-lg shadow-sm shrink-0 hidden lg:block">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-black tracking-tight text-slate-900 hidden lg:block">
                Resume Builder
              </h1>
            </div>

            <nav className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setActiveTab('content')}
                className={cn(
                  "px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === 'content' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab('design')}
                className={cn(
                  "px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === 'design' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Design
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "lg:hidden px-3 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  activeTab === 'preview' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Preview
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="hidden 2xl:flex items-center mr-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Changes Saved Locally
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-200 font-bold px-3 md:px-4 shrink-0"
              leftIcon={<ShareIcon className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPDF}
              loading={exporting}
              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 px-3 md:px-4 shrink-0"
            >
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden text-[10px]">PDF</span>
            </Button>
          </div>
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Panel: Dynamic Content (Manual toggle on mobile, static on desktop) */}
          <aside className={cn(
            "w-full lg:w-[380px] xl:w-[480px] 2xl:w-[540px] shrink-0 h-full overflow-y-auto border-r border-slate-100 bg-slate-50/40 custom-scrollbar",
            activeTab === 'preview' ? "hidden lg:block" : "block"
          )}>
            <div className="max-w-2xl mx-auto px-6 py-10">
              {activeTab === 'design' ? (
                <DesignForm />
              ) : (
                <ResumeForm />
              )}
            </div>
          </aside>

          {/* Right Panel: Live Viewport (Manual toggle on mobile, static on desktop) */}
          <main className={cn(
            "flex-1 h-full bg-slate-200/40 relative overflow-hidden",
            activeTab === 'preview' ? "block" : "hidden lg:block"
          )}>
            <ResumePreview />

            {/* Template Selector Badge */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl border border-slate-200 px-6 py-3 rounded-full flex items-center space-x-6 z-30">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Template</span>
                <span className="text-sm font-bold text-slate-900">Classic</span>
              </div>
              <div className="w-px h-4 bg-slate-200"></div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scale</span>
                <span className="text-sm font-bold text-slate-900">Fit to Width</span>
              </div>
            </div>
          </main>

        </div>
      </div>
    </ProtectedRoute>
  )
}
