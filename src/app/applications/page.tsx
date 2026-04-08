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
  LinkIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  ListBulletIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Input, Button, Textarea, Select, Modal } from '@/components/ui'
import Link from 'next/link'
import api from '@/lib/api'
import { JobApplication, JobApplicationResponse, Resume, ResumeResponse } from '@/types'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { AxiosResponse } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const jobApplicationSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
  position_title: z.string().min(2, 'Position title must be at least 2 characters').max(100),
  job_description: z.string().min(50, 'Job description must be at least 50 characters for better AI analysis').max(10000),
  application_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  application_deadline: z.string().optional().or(z.literal('')),
  notes: z.string().max(1000, 'Notes must be under 1000 characters').optional().or(z.literal('')),
  resume_id: z.string().uuid('Please select a valid resume'),
})

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      company_name: '',
      position_title: '',
      job_description: '',
      application_url: '',
      application_deadline: '',
      notes: '',
      resume_id: ''
    }
  })

  const jobDescriptionValue = watch('job_description') || ''

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

  const handleCreateApplication = async (data: JobApplicationFormData) => {
    try {
      await api.post('/api/job-application', data)
      toast.success('Application created successfully!')
      setShowCreateForm(false)
      reset()
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
      case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200'
      case 'applied': return 'bg-indigo-50 text-indigo-700 border-indigo-100'
      case 'interview': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'accepted': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100'
      default: return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const filteredApplications = applications.filter(app =>
    app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.position_title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: applications.length,
    interviewing: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'accepted').length,
    responseRate: applications.length > 0
      ? Math.round(((applications.filter(a => a.status !== 'applied' && a.status !== 'draft').length) / applications.length) * 100)
      : 0
  }

  const columns = [
    { id: 'draft', title: 'Drafts', icon: PencilIcon, color: 'text-slate-400' },
    { id: 'applied', title: 'Applied', icon: BriefcaseIcon, color: 'text-indigo-500' },
    { id: 'interview', title: 'Interviewing', icon: UserIcon, color: 'text-amber-500' },
    { id: 'accepted', title: 'Offers', icon: CheckBadgeIcon, color: 'text-emerald-500' },
    { id: 'rejected', title: 'Rejected', icon: XCircleIcon, color: 'text-rose-500' },
  ]

  if (applicationsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50/50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-3xl"></div>
                ))}
              </div>
              <div className="h-12 bg-slate-200 rounded-2xl w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-slate-200 rounded-3xl"></div>
                ))}
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

        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

          {/* Stats Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Applications" value={stats.total} icon={<BriefcaseIcon className="h-6 w-6" />} color="indigo" />
            <StatCard title="Interviewing" value={stats.interviewing} icon={<CalendarIcon className="h-6 w-6" />} color="amber" />
            <StatCard title="Response Rate" value={`${stats.responseRate}%`} icon={<SparklesIcon className="h-6 w-6" />} color="violet" />
            <StatCard title="Job Offers" value={stats.offers} icon={<CheckBadgeIcon className="h-6 w-6" />} color="emerald" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applications</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your career pipeline and AI-generated assets.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white rounded-2xl p-1 border border-slate-200 shadow-sm">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ViewColumnsIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-2.5 flex items-center shadow-lg shadow-indigo-100"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                New Application
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-10 flex items-center bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm">
            <div className="flex-1 flex items-center px-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search by company or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm py-2"
              />
            </div>
            <div className="h-8 border-l border-slate-100 mx-2 hidden md:block"></div>
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Main Content Area */}
          {applications.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-slate-200 border-dashed p-20 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <BriefcaseIcon className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
              <p className="text-slate-500 max-w-xs mx-auto mb-8">
                Start tracking your career journey. Every opportunity leads to growth.
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-8 py-3"
              >
                Create your first application
              </Button>
            </div>
          ) : viewMode === 'kanban' ? (
            <div className="flex space-x-6 overflow-x-auto pb-8 min-h-[70vh] items-start scrollbar-hide">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl bg-white border border-slate-100 shadow-sm ${column.color}`}>
                        <column.icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-black text-slate-800 tracking-tight uppercase text-xs">{column.title}</h3>
                    </div>
                    <span className="text-[10px] font-black bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded-full">
                      {applications.filter(a => a.status === column.id).length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {filteredApplications
                      .filter(a => a.status === column.id)
                      .map(application => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          onDelete={handleDeleteApplication}
                          onUpdateStatus={handleUpdateStatus}
                          onGenerateCoverLetter={handleGenerateCoverLetter}
                          getStatusColor={getStatusColor}
                        />
                      ))}
                    <button
                      onClick={() => {
                        reset({
                          company_name: '',
                          position_title: '',
                          job_description: '',
                          application_url: '',
                          application_deadline: '',
                          notes: '',
                          resume_id: ''
                        })
                        setShowCreateForm(true)
                      }}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">Add Item</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Position & Company</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Applied On</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm mr-4">
                            {application.company_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{application.position_title}</p>
                            <p className="text-xs text-slate-400 font-medium">{application.company_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-600">{formatDate(application.created_at)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${getStatusColor(application.status)}`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDeleteApplication(application.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                          <Link href={`/applications/${application.id}`} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* New Application Modal */}
          <Modal
            isOpen={showCreateForm}
            onClose={() => setShowCreateForm(false)}
            title="Track New Opportunity"
          >
            <form onSubmit={handleSubmit(handleCreateApplication)} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('company_name')}
                  label="Company Name"
                  placeholder="e.g. Google"
                  error={errors.company_name?.message}
                />
                <Input
                  {...register('position_title')}
                  label="Position Title"
                  placeholder="e.g. Senior Frontend Engineer"
                  error={errors.position_title?.message}
                />
              </div>

              <div className="relative">
                <Textarea
                  {...register('job_description')}
                  label="Job Description"
                  placeholder="Paste the requirements here for AI analysis..."
                  rows={6}
                  error={errors.job_description?.message}
                />
                <div className="absolute top-0 right-0 pt-1.5 flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${jobDescriptionValue.length < 50 ? 'text-rose-400' : 'text-emerald-500'}`}>
                    {jobDescriptionValue.length} / 50 min
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...register('application_url')}
                  type="url"
                  label="Job URL"
                  placeholder="https://career.site/job"
                  error={errors.application_url?.message}
                />
                <Input
                  {...register('application_deadline')}
                  type="date"
                  label="Deadline"
                  error={errors.application_deadline?.message}
                />
              </div>

              <Select
                {...register('resume_id')}
                label="Selected Resume"
                options={resumes.map(r => ({ value: r.id, label: r.original_filename }))}
                error={errors.resume_id?.message}
              />

              <div className="flex space-x-3 pt-6 border-t border-slate-100">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowCreateForm(false)}>Cancel</Button>
                <Button
                  variant="primary"
                  className="flex-1 rounded-xl bg-indigo-600"
                  type="submit"
                  loading={isSubmitting}
                >
                  Add Application
                </Button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </ProtectedRoute>
  )
}

function StatCard({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) {
  const colorMap: any = {
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center space-x-4">
      <div className={`p-4 rounded-3xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  )
}

function ApplicationCard({ application, onDelete, onUpdateStatus, onGenerateCoverLetter, getStatusColor }: {
  application: JobApplication,
  onDelete: (id: string) => void,
  onUpdateStatus: (id: string, s: string) => void,
  onGenerateCoverLetter: (id: string) => void,
  getStatusColor: (s: string) => string
}) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-sm mr-3 border border-slate-100">
            {application.company_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-slate-900 text-sm truncate max-w-[140px] leading-tight">{application.position_title}</h4>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mt-0.5">{application.company_name}</p>
          </div>
        </div>
        <div className="flex items-center -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDelete(application.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors">
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-5">
        <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <ClockIcon className="h-3 w-3 mr-1" />
          {formatDate(application.created_at)}
        </div>
        {application.application_url && (
          <a href={application.application_url} target="_blank" className="text-indigo-400 hover:text-indigo-600">
            <LinkIcon className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <select
          value={application.status}
          onChange={(e) => onUpdateStatus(application.id, e.target.value)}
          className="text-[10px] font-black uppercase tracking-tight bg-slate-50 border-none rounded-lg focus:ring-0 py-1 pl-2 pr-6 h-7"
        >
          <option value="draft">Draft</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="accepted">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onGenerateCoverLetter(application.id)}
            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-50"
            title="AI Cover Letter"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
          </button>
          <Link
            href={`/applications/${application.id}`}
            className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all"
          >
            <EyeIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
