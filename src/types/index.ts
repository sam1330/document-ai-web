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

export interface Resume {
  id: string
  user_id: string
  original_filename: string
  file_path: string
  file_type: string
  file_size: number
  extracted_text: string
  analysis_results?: any
  is_processed: boolean
  created_at: string
  updated_at: string
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

export interface DashboardOverview {
  total_resumes: number
  total_applications: number
  applications_this_month: number
  ai_requests_this_month: number
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
