'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  BriefcaseIcon, 
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  SparklesIcon,
  CalendarIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/lib/api'
import { JobApplication, JobApplicationResponse, Resume, ResumeResponse } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { AxiosResponse } from 'axios'

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    company_name: '',
    position_title: '',
    job_description: '',
    application_url: '',
    application_deadline: '',
    notes: '',
    resume_id: ''
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [applicationsRes, resumesRes]: [AxiosResponse<JobApplicationResponse>, AxiosResponse<ResumeResponse>] = await Promise.all([
        api.get('/api/job-application'),
        api.get('/api/resume')
      ])
      setApplications(applicationsRes.data.job_applications)
      setResumes(resumesRes.data.resumes)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load applications')
    } finally {
      setApplicationsLoading(false)
    }
  }

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/api/job-application', formData)
      toast.success('Application created successfully!')
      setShowCreateForm(false)
      setFormData({
        company_name: '',
        position_title: '',
        job_description: '',
        application_url: '',
        application_deadline: '',
        notes: '',
        resume_id: ''
      })
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create application')
    }
  }

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    try {
      await api.delete(`/api/job-application/${applicationId}`)
      toast.success('Application deleted successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete application')
    }
  }

  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      await api.put(`/api/job-application/${applicationId}`, { status })
      toast.success('Status updated successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleGenerateCoverLetter = async (applicationId: string) => {
    try {
      await api.post(`/api/job-application/${applicationId}/cover-letter`)
      toast.success('Cover letter generation started! Check back in a few minutes.')
      fetchData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate cover letter')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'applied': return 'bg-blue-100 text-blue-800'
      case 'interview': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (applicationsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
              <p className="mt-2 text-sm text-gray-700">
                Track and manage your job applications with AI-powered cover letter generation.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Application
              </button>
            </div>
          </div>

          {/* Create Application Form */}
          {showCreateForm && (
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Create New Application
                </h3>
                <form onSubmit={handleCreateApplication} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Position Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.position_title}
                        onChange={(e) => setFormData({...formData, position_title: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.job_description}
                      onChange={(e) => setFormData({...formData, job_description: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Application URL
                      </label>
                      <input
                        type="url"
                        value={formData.application_url}
                        onChange={(e) => setFormData({...formData, application_url: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.application_deadline}
                        onChange={(e) => setFormData({...formData, application_deadline: e.target.value})}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Resume
                    </label>
                    <select
                      required
                      value={formData.resume_id}
                      onChange={(e) => setFormData({...formData, resume_id: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a resume</option>
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.original_filename}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Create Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Applications List */}
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start tracking your job applications.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New Application
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.position_title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {application.company_name}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          Applied on {formatDate(application.created_at)}
                          {application.application_deadline && (
                            <>
                              <span className="mx-2">•</span>
                              Deadline: {formatDate(application.application_deadline)}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleGenerateCoverLetter(application.id)}
                            className="text-indigo-400 hover:text-indigo-600"
                            title="Generate Cover Letter"
                          >
                            <SparklesIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(application.id)}
                            className="text-red-400 hover:text-red-600"
                            title="Delete Application"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {application.job_description && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {application.job_description}
                        </p>
                      </div>
                    )}

                    {application.application_url && (
                      <div className="mt-4">
                        <a
                          href={application.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <LinkIcon className="mr-1 h-4 w-4" />
                          View Job Posting
                        </a>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <select
                          value={application.status}
                          onChange={(e) => handleUpdateStatus(application.id, e.target.value)}
                          className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="applied">Applied</option>
                          <option value="interview">Interview</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <Link
                        href={`/applications/${application.id}`}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        <EyeIcon className="mr-1 h-4 w-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </ProtectedRoute>
  )
}
