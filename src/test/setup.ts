import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js Navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next-intl
const translations: Record<string, string> = {
  'applications.newApplication': 'New Application',
  'applications.modal.title': 'New Application',
  'applications.modal.companyName': 'Company Name',
  'applications.modal.companyNamePlaceholder': 'Enter company name',
  'applications.modal.positionTitle': 'Position Title',
  'applications.modal.positionTitlePlaceholder': 'Enter position title',
  'applications.modal.jobDescription': 'Job Description',
  'applications.modal.jobDescriptionPlaceholder': 'Enter job description',
  'applications.modal.jobUrl': 'Job URL',
  'applications.modal.jobUrlPlaceholder': 'https://example.com',
  'applications.modal.deadline': 'Deadline',
  'applications.modal.selectedResume': 'Selected Resume',
  'applications.modal.minCharacters': 'min',
  'applications.modal.cancel': 'Cancel',
  'applications.modal.addApplication': 'Add Application',
  'applications.validation.companyNameMin': 'Company name must be at least 2 characters',
  'applications.validation.positionTitleMin': 'Position title must be at least 2 characters',
  'applications.validation.jobDescriptionMin': 'Job description must be at least 50 characters',
  'applications.validation.invalidUrl': 'Please enter a valid URL',
  'applications.validation.selectResume': 'Please select a resume',
  'applications.validation.notesMax': 'Notes must be less than 1000 characters',
  'applications.toasts.loadFailed': 'Failed to load applications',
  'applications.toasts.createSuccess': 'Application created successfully',
  'applications.toasts.createFailed': 'Failed to create application',
  'applications.confirmations.deleteApplication': 'Are you sure you want to delete this application?',
  'applications.toasts.deleteSuccess': 'Application deleted successfully',
  'applications.toasts.deleteFailed': 'Failed to delete application',
  'applications.toasts.statusUpdateSuccess': 'Status updated successfully',
  'applications.toasts.statusUpdateFailed': 'Failed to update status',
  'applications.toasts.coverLetterSuccess': 'Cover letter generated successfully',
  'applications.toasts.coverLetterFailed': 'Failed to generate cover letter',
  'applications.stats.totalApplications': 'Total Applications',
  'applications.stats.interviewing': 'Interviewing',
  'applications.stats.responseRate': 'Response Rate',
  'applications.stats.jobOffers': 'Job Offers',
  'applications.columns.drafts': 'Drafts',
  'applications.columns.applied': 'Applied',
  'applications.columns.interviewing': 'Interviewing',
  'applications.columns.offers': 'Offers',
  'applications.columns.rejected': 'Rejected',
  'applications.title': 'Job Applications',
  'applications.subtitle': 'Track and manage your job applications',
  'applications.searchPlaceholder': 'Search applications...',
  'applications.filters': 'Filters',
  'applications.emptyState.title': 'No applications yet',
  'applications.emptyState.description': 'Start tracking your job applications',
  'applications.emptyState.buttonText': 'Create Application',
  'applications.addItem': 'Add Item',
  'applications.table.positionAndCompany': 'Position & Company',
  'applications.table.appliedOn': 'Applied On',
  'applications.table.status': 'Status',
  'applications.table.actions': 'Actions',
  'applications.status.draft': 'Draft',
  'applications.status.applied': 'Applied',
  'applications.status.interview': 'Interview',
  'applications.status.offer': 'Offer',
  'applications.status.rejected': 'Rejected',
  'applications.actions.aiCoverLetter': 'Generate Cover Letter',
  'applications.actions.viewDetails': 'View Details',
}

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => translations[key] || key,
}))

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
  },
}))

// Mock matchMedia for framer-motion/headlessui
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
} as any
