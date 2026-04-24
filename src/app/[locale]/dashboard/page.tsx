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
  ArrowDownIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import api from '@/lib/api'
import { DashboardOverview, Resume, JobApplication, ResumeResponse, JobApplicationResponse } from '@/types'
import { formatDate } from '@/lib/utils'
import { AxiosResponse } from 'axios'
import { Button } from '@/components/ui'
import { CreditUtilityGuide } from '@/components/ui'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations()
  const { user } = useAuth()
  const [overview, setOverview] = useState<DashboardOverview | null>({
    overview: {
      total_resumes: 0,
      total_applications: 0,
      analyzed_count: 0,
      avg_score: 0,
      monthly_cost: 0,
      applications_this_month: 0,
      ai_requests_this_month: 0,
    },
    resume_analytics: {
      score_distribution: {
        poor: 0,
        average: 0,
        good: 0,
      },
      top_strengths: [],
      top_weaknesses: [],
      recent_analyses: [],
    },
    recent_activity: [],
    subscription_status: '',
    subscription_expires_at: '',
  })
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/dashboard/overview')
      setOverview(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setDashboardLoading(false)
    }
  }

  const buildActivityLink = (type: string, id: string) => {
    if (type === 'resume_upload') {
      return `/resumes/${id}`
    } else if (type === 'job_application') {
      return `/applications/${id}`
    }
    return ''
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
      name: t('dashboard.stats.totalResumes'),
      value: overview?.overview.total_resumes || 0,
      icon: DocumentTextIcon,
      changeType: 'positive' as const,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      name: t('dashboard.stats.applications'),
      value: overview?.overview.total_applications || 0,
      icon: BriefcaseIcon,
      changeType: 'positive' as const,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      name: t('dashboard.stats.avgMatchScore'),
      value: `${overview?.overview.avg_score || 0}`,
      icon: ArrowTrendingUpIcon,
      changeType: 'positive' as const,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      name: t('dashboard.stats.aiImpact'),
      value: overview?.overview.ai_requests_this_month || 0,
      icon: SparklesIcon,
      changeType: 'positive' as const,
      gradient: 'from-amber-500 to-orange-600',
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

          {/* Welcome Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {t('dashboard.welcome', { name: user?.first_name || '' })}
              </h1>
              <p className="mt-2 text-slate-500 text-lg">
                {t.rich('dashboard.subtitle', {
                  counter: overview?.overview.analyzed_count || 0,
                  count: (chunks) => <span className="text-indigo-600 font-semibold">{chunks}</span>
                })}
              </p>
            </div>
            <div className="flex space-x-3">
              <Link href="/resumes">
                <Button className="inline-flex items-center text-md px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                  <PlusIcon className="h-5 w-5 mr-1.5" />
                  {t('dashboard.analyzeNew')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.name} className="relative group overflow-hidden bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-bl-full`} />
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg shadow-indigo-100`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.name}</dt>
                  <dd className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</dd>
                  {stat.name === t('dashboard.stats.aiImpact') && (
                    <div className="mt-3">
                      <CreditUtilityGuide />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* AI Career Insights */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden leading-relaxed">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center">
                    <SparklesIcon className="h-6 w-6 text-indigo-600 mr-2" />
                    {t('dashboard.aiInsights.title')}
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    {t('dashboard.aiInsights.badge')}
                  </span>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Strengths */}
                    <div>
                      <div className="flex items-center mb-5">
                        <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mr-2" />
                        <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">{t('dashboard.aiInsights.keyStrengths')}</h4>
                      </div>
                      <div className="space-y-3">
                        {overview?.resume_analytics.top_strengths.map((strength, i) => (
                          <div key={i} className="flex items-center p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl transition hover:border-emerald-200">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3" />
                            <span className="text-sm font-medium text-slate-700">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Weaknesses */}
                    <div>
                      <div className="flex items-center mb-5">
                        <ExclamationCircleIcon className="h-5 w-5 text-amber-500 mr-2" />
                        <h4 className="font-bold text-slate-800 uppercase text-sm tracking-wide">{t('dashboard.aiInsights.growthAreas')}</h4>
                      </div>
                      <div className="space-y-3">
                        {overview?.resume_analytics.top_weaknesses.map((weakness, i) => (
                          <div key={i} className="flex items-center p-3 bg-amber-50/50 border border-amber-100 rounded-xl transition hover:border-amber-200">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3" />
                            <span className="text-sm font-medium text-slate-700">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Distribution */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
                  {t('dashboard.scoreDistribution.title')}
                </h3>
                <div className="space-y-6">
                  {(['good', 'average', 'poor'] as const).map((level) => {
                    const count = overview?.resume_analytics.score_distribution[level] || 0;
                    const total = (overview?.resume_analytics.score_distribution.good || 0) +
                      (overview?.resume_analytics.score_distribution.average || 0) +
                      (overview?.resume_analytics.score_distribution.poor || 0) || 1;
                    const percentage = (count / total) * 100;
                    const color = level === 'good' ? 'bg-emerald-500' : level === 'average' ? 'bg-amber-500' : 'bg-rose-500';

                    return (
                      <div key={level}>
                        <div className="flex justify-between text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                          <span>{t(`dashboard.scoreDistribution.${level}`)}</span>
                          <span>{count} {t('dashboard.scoreDistribution.profiles')}</span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${color} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full leading-relaxed">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <ClockIcon className="h-6 w-6 text-indigo-600 mr-2" />
                  {t('dashboard.recentActivity.title')}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {overview?.recent_activity.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-slate-400 font-medium">{t('dashboard.recentActivity.noActivity')}</p>
                    </div>
                  ) : (
                    overview?.recent_activity?.map((activity, i) => (
                      <Link key={i} href={buildActivityLink(activity.type, activity.id)}>
                        <div key={i} className="group p-4 rounded-2xl hover:bg-slate-50 transition-colors flex items-start space-x-4 border border-transparent hover:border-slate-100">
                          <div className={`p-2 rounded-xl mt-1 ${activity.type === 'resume_upload' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'job_application' ? 'bg-purple-100 text-purple-600' :
                              'bg-indigo-100 text-indigo-600'
                            }`}>
                            {activity.type === 'resume_upload' ? <DocumentTextIcon className="h-5 w-5" /> :
                              activity.type === 'job_application' ? <BriefcaseIcon className="h-5 w-5" /> :
                                <SparklesIcon className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                              {activity.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                            <div className="flex items-center mt-2 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                              <span>{formatDate(activity.timestamp)}</span>
                              {activity.status && (
                                <>
                                  <span className="mx-1.5">•</span>
                                  <span className={activity.status === 'Processed' || activity.status === 'Accepted' ? 'text-emerald-500' : 'text-indigo-500'}>
                                    {activity.status}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ArrowRightIcon className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 mt-1 transition-colors" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100">
                <Link href="/resumes">
                  <button className="w-full py-3 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center">
                    {t('dashboard.recentActivity.viewHistory')}
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
