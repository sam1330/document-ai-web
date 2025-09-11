'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  SparklesIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/lib/api'
import { DashboardOverview, Resume, JobApplication, ResumeResponse, JobApplicationResponse } from '@/types'
import { formatDate } from '@/lib/utils'
import { AxiosResponse } from 'axios'

export default function DashboardPage() {
  const { user } = useAuth()
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [recentResumes, setRecentResumes] = useState<Resume[]>([])
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, resumesRes, applicationsRes]: [AxiosResponse<DashboardOverview>, AxiosResponse<ResumeResponse>, AxiosResponse<JobApplicationResponse>] = await Promise.all([
        api.get('/api/dashboard/overview'),
        api.get('/api/resume'),
        api.get('/api/job-application')
      ])
      
      setOverview(overviewRes.data)
      setRecentResumes(resumesRes.data.resumes.slice(0, 3))
      setRecentApplications(applicationsRes.data.job_applications.slice(0, 3))
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setDashboardLoading(false)
    }
  }

  if (dashboardLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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

  const stats = [
    {
      name: 'Total Resumes',
      value: overview?.total_resumes || 0,
      icon: DocumentTextIcon,
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      name: 'Job Applications',
      value: overview?.total_applications || 0,
      icon: BriefcaseIcon,
      change: '+8%',
      changeType: 'positive' as const,
    },
    {
      name: 'This Month',
      value: overview?.applications_this_month || 0,
      icon: ChartBarIcon,
      change: '+23%',
      changeType: 'positive' as const,
    },
    {
      name: 'AI Requests',
      value: overview?.ai_requests_this_month || 0,
      icon: SparklesIcon,
      change: '+15%',
      changeType: 'positive' as const,
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.first_name}! Here's what's happening with your job search.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.changeType === 'positive' ? (
                              <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                            </span>
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Resumes */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Resumes
                  </h3>
                  <Link
                    href="/resumes"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </Link>
                </div>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentResumes.length === 0 ? (
                      <li className="py-4">
                        <div className="text-center">
                          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Get started by uploading your first resume.
                          </p>
                          <div className="mt-6">
                            <Link
                              href="/resumes"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                              Upload Resume
                            </Link>
                          </div>
                        </div>
                      </li>
                    ) : (
                      recentResumes.map((resume) => (
                        <li key={resume.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {resume.original_filename}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(resume.created_at)}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                resume.is_processed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {resume.is_processed ? 'Processed' : 'Processing'}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Applications
                  </h3>
                  <Link
                    href="/applications"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </Link>
                </div>
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {recentApplications.length === 0 ? (
                      <li className="py-4">
                        <div className="text-center">
                          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Start tracking your job applications.
                          </p>
                          <div className="mt-6">
                            <Link
                              href="/applications"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                              New Application
                            </Link>
                          </div>
                        </div>
                      </li>
                    ) : (
                      recentApplications.map((application) => (
                        <li key={application.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <BriefcaseIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {application.position_title}
                              </p>
                              <p className="text-sm text-gray-500">
                                {application.company_name} • {formatDate(application.created_at)}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                application.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
