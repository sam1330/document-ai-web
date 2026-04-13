'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Input, Button } from '@/components/ui'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

interface ForgotPasswordForm {
  email: string
}

function ForgotPasswordContent() {
  const { requestPasswordReset } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>()

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await requestPasswordReset(data.email)
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error
      toast.error(message || 'Failed to send password reset email')
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <EnvelopeIcon className="h-10 w-10 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We sent a password reset link to <span className="font-medium text-gray-900">{submittedEmail}</span>.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
            <div className="space-y-6">
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <ul className="list-disc list-inside text-gray-500 space-y-1">
                  <li>Check your spam folder</li>
                  <li>Didn't receive it? Try again below</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Resend reset email
                </Button>

                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <EnvelopeIcon className="h-10 w-10 text-indigo-600" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              leftIcon={<EnvelopeIcon />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : 'Send reset link'}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-pulse h-16 w-16 mx-auto rounded-full bg-gray-200" />
            <div className="mt-6 animate-pulse h-8 w-48 mx-auto bg-gray-200 rounded" />
            <div className="mt-2 animate-pulse h-4 w-64 mx-auto bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  )
}
