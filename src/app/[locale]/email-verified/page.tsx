'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircleIcon, XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

type VerificationState = 'verifying' | 'success' | 'error' | 'already-verified'

function EmailVerifiedContent() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyEmail } = useAuth()
  const token = searchParams.get('token')

  const [state, setState] = useState<VerificationState>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  const verify = async (token: string) => {
      try {
        await verifyEmail(token)
        setState('success')
        toast.success(t('emailVerified.emailVerifiedToast'))
      } catch (error: any) {
        const code = error.response?.data?.code
        const message = error.response?.data?.message || error.response?.data?.error

        if (code === 'ALREADY_VERIFIED') {
          setState('already-verified')
        } else if (code === 'TOKEN_EXPIRED') {
          setState('error')
          setErrorMessage(message || t('emailVerified.tokenExpired'))
        } else if (code === 'INVALID_TOKEN') {
          setState('error')
          setErrorMessage(message || t('emailVerified.invalidToken'))
        } else {
          setState('error')
          setErrorMessage(message || t('emailVerified.failedToVerify'))
        }
        toast.error(message || t('emailVerified.emailVerificationFailed'))
      }
    }

  useEffect(() => {
    if (!token) {
      setState('error')
      setErrorMessage(t('emailVerified.noToken'))
      return
    }

    (async () => await verify(token))()
  }, [])

  const renderContent = () => {
    switch (state) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 animate-pulse">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t('emailVerified.verifying')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('emailVerified.pleaseWait')}
            </p>
          </div>
        )

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircleIcon className="h-10 w-10 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t('emailVerified.emailVerifiedSuccess')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('emailVerified.emailVerifiedMessage')}
            </p>
          </div>
        )

      case 'already-verified':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <CheckCircleIcon className="h-10 w-10 text-blue-600" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t('emailVerified.emailAlreadyVerified')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('emailVerified.alreadyVerifiedMessage')}
            </p>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <XCircleIcon className="h-10 w-10 text-red-600" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {t('emailVerified.verificationFailed')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {errorMessage}
            </p>
          </div>
        )
    }
  }

  const renderActions = () => {
    if (state === 'verifying') return null

    if (state === 'error') {
      return (
        <div className="space-y-3">
          <Link href="/email-verification">
            <Button variant="primary" size="lg" className="w-full">
              {t('emailVerified.requestNewVerification')}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="w-full">
              {t('emailVerification.backToSignIn')}
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <Link href="/dashboard">
          <Button variant="primary" size="lg" className="w-full">
            {t('emailVerified.goToDashboard')}
            <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {renderContent()}

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <div className="text-center space-y-6">
            {state !== 'verifying' && (
              <p className="text-sm text-gray-600">
                {state === 'success' || state === 'already-verified'
                  ? t('emailVerified.accessAllFeatures')
                  : t('emailVerified.tokenExpiredInfo')}
              </p>
            )}

            {renderActions()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailVerifiedPage() {
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
      <EmailVerifiedContent />
    </Suspense>
  )
}
