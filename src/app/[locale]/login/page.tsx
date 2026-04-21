import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Haku account to access AI-powered resume analysis, ATS scoring, and job application tracking.',
  robots: { index: false, follow: true },
}

export default function LoginPage() {
  return <LoginClient />
}
