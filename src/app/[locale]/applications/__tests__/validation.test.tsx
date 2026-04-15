import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ApplicationsPage from '../page'
import { AuthContext } from '@/contexts/AuthContext'
import '@testing-library/jest-dom'
import api from '@/lib/api'

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/api/job-applications') return Promise.resolve({ data: { job_applications: [], pagination: {} } });
      if (url === '/api/resumes') return Promise.resolve({ data: { resumes: [{ id: 'res-1', original_filename: 'Test Resume' }] } });
      return Promise.resolve({ data: [] });
    }),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  }
}))

vi.mock('@/components/ProtectedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

vi.mock('@/components/Navigation', () => ({
  default: () => <div data-testid="mock-nav">Navigation</div>
}))

import { User } from '@/types'

// Mock AuthContext provider
const mockUser: User = {
  id: 'user-1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  subscription_type: 'free',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn(),
  }),
  AuthContext: {
    Provider: ({ children, value }: any) => <div data-testid="auth-provider">{children}</div>
  }
}))

const renderWithAuth = (component: React.ReactNode) => {
  return render(component)
}

describe('ApplicationsPage Integration', () => {
  it('should show validation error if company name is too short', async () => {
    // Suppress console.error for expected act warnings in tests
    const spy = vi.spyOn(console, 'error').mockImplementation(() => { });

    renderWithAuth(<ApplicationsPage />)

    // Wait for the skeleton loader to disappear and find the 'New Application' button by role
    // Increase timeout to 5s to be absolutely sure JSDOM has rendered
    const addBtn = await screen.findByRole('button', { name: /new application/i }, { timeout: 5000 })
    fireEvent.click(addBtn)

    // Fill in a 1-character company name
    const companyInput = screen.getByLabelText(/Company Name/i)
    fireEvent.change(companyInput, { target: { value: 'A' } })

    // Submit using the button in the modal
    const submitBtn = screen.getByRole('button', { name: /^Add Application$/i })
    fireEvent.click(submitBtn)

    // Check for error
    await waitFor(() => {
      expect(screen.getByText(/Company name must be at least 2 characters/i)).toBeInTheDocument()
    })

    spy.mockRestore();
  })

  it('should update character count for job description', async () => {
    renderWithAuth(<ApplicationsPage />)

    // Wait for the skeleton loader to disappear
    const addBtn = await screen.findByRole('button', { name: /new application/i })
    fireEvent.click(addBtn)

    const textarea = screen.getByLabelText(/Job Description/i)
    fireEvent.change(textarea, { target: { value: 'This is a long test description to check the character counter' } })

    expect(screen.getByText(/62 \/ 50 min/i)).toBeInTheDocument()
    expect(screen.getByText(/62 \/ 50 min/i)).toHaveClass('text-emerald-500')
  })
})
