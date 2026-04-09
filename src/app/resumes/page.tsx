'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/lib/api'
import { Resume, Analysis } from '@/types'
import { formatDate, formatFileSize } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Modal, Textarea, Button, Input } from '@/components/ui'
import { useCredits } from '@/contexts/CreditContext'

export default function ResumesPage() {
  const { user } = useAuth();
  const { getBalance } = useCredits();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'analyzed' | 'pending'>('all');

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user])

  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = 
      statusFilter === 'all' ? true :
      statusFilter === 'analyzed' ? !!resume.latest_analysis :
      statusFilter === 'pending' ? !resume.latest_analysis && resume.is_processed : true
    
    return matchesSearch && matchesFilter
  })

  const fetchResumes = async () => {
    try {
      const response = await api.get('/api/resume')
      setResumes(response.data.resumes || [])
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
      toast.error('Failed to load resumes')
      setResumes([]);
    } finally {
      setResumesLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOCX file')
      return
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('resume', file)

    try {
      await api.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Resume uploaded successfully!')
      fetchResumes()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload resume')
    } finally {
      setUploading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      await api.delete(`/api/resume/${resumeId}`)
      toast.success('Resume deleted successfully!')
      fetchResumes()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete resume')
    }
  }

  const handleAnalyzeClick = (resumeId: string) => {
    setSelectedResumeId(resumeId)
    setJobDescription('')
    setTargetRole('')
    setTargetCompany('')
    setIsAnalyzeModalOpen(true)
  }

  const handleConfirmAnalyze = async () => {
    if (!selectedResumeId) return
    if (!jobDescription.trim() || !targetRole.trim() || !targetCompany.trim()) {
      toast.error('All fields are required')
      return
    }

    setAnalyzing(true)
    try {
      await api.post(`/api/resume/${selectedResumeId}/analyze`, {
        job_description: jobDescription,
        target_role: targetRole,
        target_company: targetCompany
      })
      toast.success('Resume analysis completed!')
      getBalance();
      setIsAnalyzeModalOpen(false)
      fetchResumes()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  if (resumesLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                Resume Repository
              </h1>
              <p className="mt-2 text-slate-500 text-lg">
                Manage your professional documents and track AI analyses across various roles.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <label className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 cursor-pointer group">
                <CloudArrowUpIcon className="h-5 w-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Upload New
                <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} className="hidden" />
              </label>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resumes by filename..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-slate-400 ml-2" />
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                {(['all', 'analyzed', 'pending'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                      statusFilter === filter ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {resumes.length === 0 ? (
            /* Enhanced Empty State / Dropzone */
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 transition-all duration-300">
                <div className="p-6 bg-indigo-50 rounded-full mb-6">
                  <DocumentTextIcon className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build your Talent Library</h3>
                <p className="text-slate-500 text-center max-w-sm mb-10">
                  Upload your CV in PDF or DOCX format. Our AI handles the extraction and deep analysis against any role.
                </p>
                <label className="inline-flex items-center px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition shadow-xl shadow-indigo-200 cursor-pointer">
                  Select your Resume
                  <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Supports PDF and DOCX (Max 10MB)</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResumes.map((resume) => (
                <div key={resume.id} className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full leading-relaxed overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-50 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${resume.file_type === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                        <DocumentTextIcon className="h-7 w-7" />
                      </div>
                      <div className="flex space-x-1">
                        <button onClick={() => handleDeleteResume(resume.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-1">
                      {resume.original_filename}
                    </h3>
                    <div className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-tight">
                      <span>{formatFileSize(resume.file_size)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(resume.created_at)}</span>
                    </div>

                    {/* Latest Analysis Info */}
                    <div className="mt-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                      {resume.latest_analysis ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Analysis</span>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-black ring-1 ${
                              resume.latest_analysis.analysis_results.atsScore >= 70 ? 'bg-emerald-50 text-emerald-600 ring-emerald-200' : 
                              resume.latest_analysis.analysis_results.atsScore >= 40 ? 'bg-amber-50 text-amber-600 ring-amber-200' : 
                              'bg-rose-50 text-rose-600 ring-rose-200'
                            }`}>
                              Score: {resume.latest_analysis.analysis_results.atsScore}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{resume.latest_analysis.target_role}</p>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">at {resume.latest_analysis.target_company}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 text-slate-400 italic">
                          <InformationCircleIcon className="h-5 w-5 opacity-50" />
                          <span className="text-xs font-medium">Ready for deep analysis</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 bg-slate-50/30">
                    <div className="flex flex-col space-y-3">
                      <Button
                        onClick={() => handleAnalyzeClick(resume.id)}
                        disabled={!resume.is_processed || analyzing}
                        className="w-full py-3 text-md bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center disabled:opacity-50"
                      >
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        {resume.latest_analysis ? 'New Analysis' : 'Go Detailed Analysis'}
                      </Button>
                      
                      {resume.latest_analysis && (
                        <Link href={`/resumes/${resume.id}`}>
                          <Button className="w-full py-3 text-md bg-white text-indigo-600 border border-indigo-100 font-bold rounded-xl hover:bg-indigo-50 transition flex items-center justify-center">
                            <EyeIcon className="h-5 w-5 mr-2" />
                            View Last Report
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      <Modal
        isOpen={isAnalyzeModalOpen}
        onClose={() => !analyzing && setIsAnalyzeModalOpen(false)}
        title="Analyze Resume"
        subtitle="This action will cost you 10 credits"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsAnalyzeModalOpen(false)}
              disabled={analyzing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAnalyze}
              loading={analyzing}
              disabled={!jobDescription.trim()}
            >
              Start Analysis
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Target Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              required
            />
            <Input
              label="Target Company"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="e.g. Google"
              required
            />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Paste the job description below to tailor the AI analysis to this specific role.
          </p>
          <Textarea
            label="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full text-slate-700 rounded-2xl"
            required
          />
        </div>
      </Modal>
    </ProtectedRoute>
  )
}
