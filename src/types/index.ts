export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  subscription_type: 'free' | 'pro'
  subscription_expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ResumeResponse {
  resumes: Resume[],
  pagination: {
    limit: number,
    page: number,
    pages: number,
    total: number,
  }
}

export interface Analysis {
  id: string
  resume_id: string
  target_role: string
  target_company: string
  job_description: string
  analysis_results: {
    overview: string
    atsScore: number
    strongPoints: string[]
    weaknesses: string[]
  }
  created_at: string
}

export interface Resume {
  id: string
  user_id: string
  original_filename: string
  file_path?: string
  file_type: string
  file_size: number
  extracted_text: string
  is_processed: boolean
  created_at: string
  updated_at: string
}

export interface ResumeDetailResponse {
  resume: Resume,
  latest_analysis?: Analysis
  has_text: boolean,
  text_length: number,
}

export interface AnalysesListResponse {
  analyses: Analysis[]
}

export interface JobApplicationResponse {
  job_applications: JobApplication[],
  pagination: {
    limit: number,
    page: number,
    pages: number,
    total: number,
  }
}

export interface JobApplication {
  id: string
  user_id: string
  resume_id: string
  company_name: string
  position_title: string
  job_description: string
  application_url?: string
  application_deadline?: string
  status: 'draft' | 'applied' | 'interview' | 'rejected' | 'accepted'
  notes?: string
  cover_letter_data?: any
  created_at: string
  updated_at: string
}

export interface AIRequest {
  id: string
  user_id: string
  request_type: 'resume_analysis' | 'cover_letter_generation' | 'resume_optimization'
  input_data: any
  response_data: any
  status: string
  tokens_used: number
  cost: number
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ActivityItem {
  id: string
  type: 'resume' | 'application' | 'analysis'
  title: string
  subtitle: string
  status?: string
  date: string
  link: string
}

export interface DashboardOverview {
  overview: {
    total_resumes: number
    total_applications: number
    analyzed_count: number
    avg_score: number
    monthly_cost: number
    applications_this_month: number
    ai_requests_this_month: number
  }
  resume_analytics: {
    score_distribution: {
      poor: number
      average: number
      good: number
    }
    top_strengths: string[]
    top_weaknesses: string[]
    recent_analyses: any[]
  }
  recent_activity: ActivityItem[]
  subscription_status: string
  subscription_expires_at?: string
}

export interface AIUsageStats {
  total_requests: number
  requests_this_month: number
  total_tokens_used: number
  total_cost: number
  requests_by_type: {
    resume_analysis: number
    cover_letter_generation: number
    resume_optimization: number
  }
}
