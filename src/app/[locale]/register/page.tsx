import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Create Free Account',
  description: 'Join Haku for free and get 30 complimentary tokens. Optimize your resume with AI, beat ATS filters, and land more interviews — no subscription required.',
  openGraph: {
    title: 'Create Free Account | Haku – AI Resume Analyzer',
    description: 'Join Haku for free and get 30 complimentary tokens. Optimize your resume with AI, beat ATS filters, and land more interviews.',
    url: 'https://haku-ai.com/en/register',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Free Account | Haku',
    description: 'Join Haku for free and get 30 complimentary tokens.',
  },
}

export default function RegisterPage() {
  return <RegisterClient />
}
