'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Input, Button } from '@/components/ui'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

interface ResendForm {
  email: string
}

function EmailVerificationContent() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const { resendVerification } = useAuth()
  const emailFromQuery = searchParams.get('email') || ''

  const [isSent, setIsSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResendForm>({
    defaultValues: { email: emailFromQuery }
  })

  const onSubmit = async (data: ResendForm) => {
    try {
      await resendVerification(data.email)
      setIsSent(true)
      toast.success(t('auth.emailVerification.emailSentToast'))
    } catch (error: any) {
      const code = error.response?.data?.code
      const message = error.response?.data?.message || error.response?.data?.error

      if (code === 'ALREADY_VERIFIED') {
        toast.error(t('auth.emailVerification.alreadyVerifiedToast'))
      } else if (code === 'USER_NOT_FOUND') {
        toast.error(t('auth.emailVerification.userNotFound'))
      } else {
        toast.error(message || t('auth.emailVerification.failedToSend'))
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
            <EnvelopeIcon className="h-10 w-10 text-indigo-600" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {t('auth.emailVerification.checkYourEmail')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.emailVerification.weSentVerification')}
            {emailFromQuery && (
              <>
                {' '}{t('auth.emailVerification.pleaseCheck')} <span className="font-medium text-gray-900">{emailFromQuery}</span>.
              </>
            )}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <div className="space-y-6">
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong>{t('auth.emailVerification.didntReceiveEmail')}</strong> {t('auth.emailVerification.enterEmailBelow')}
              </p>
              <ul className="list-disc list-inside text-gray-500 space-y-1">
                <li>{t('auth.emailVerification.checkSpam')}</li>
                <li>{t('auth.emailVerification.linksExpire')}</li>
              </ul>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register('email', {
                  required: t('auth.emailVerification.emailRequired'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('auth.emailVerification.invalidEmail')
                  }
                })}
                type="email"
                label={t('auth.emailVerification.emailAddress')}
                placeholder={t('auth.emailVerification.enterYourEmail')}
                leftIcon={<EnvelopeIcon />}
                error={errors.email?.message}
                autoComplete="email"
                disabled={isSubmitting}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t('auth.emailVerification.sending') : t('auth.emailVerification.resendEmail')}
              </Button>
            </form>

            {isSent && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  {t('auth.emailVerification.emailSentSuccess')}
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('auth.emailVerification.backToSignIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmailVerificationPage() {
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
      <EmailVerificationContent />
    </Suspense>
  )
}
