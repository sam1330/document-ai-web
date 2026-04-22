'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Input, Button } from '@/components/ui'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

interface ForgotPasswordForm {
  email: string
}

export default function ForgotPasswordClient() {
  const t = useTranslations('auth.forgotPasswordPage')
  const { requestPasswordReset } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const { executeRecaptcha } = useGoogleReCaptcha()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>()

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      let recaptchaToken = ''
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('forgot_password')
      }

      await requestPasswordReset(data.email, recaptchaToken)
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
      toast.success(t('successToast'))
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error
      toast.error(message || t('errorToast'))
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
              {t('checkEmail')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t.rich('weSentLink', {
                email: (chunks) => <span className="font-medium text-gray-900">{submittedEmail}</span>
              })}
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
            <div className="space-y-6">
              <div className="text-sm text-gray-600 space-y-3">
                <p>{t('clickLink')}</p>
                <ul className="list-disc list-inside text-gray-500 space-y-1">
                  <li>{t('checkSpam')}</li>
                  <li>{t('didntReceive')}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  {t('resendButton')}
                </Button>

                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    {t('backToSignIn')}
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
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('email', {
                required: t('emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('invalidEmail')
                }
              })}
              type="email"
              label={t('emailLabel')}
              placeholder={t('emailPlaceholder')}
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
              {isSubmitting ? t('sending') : t('sendLinkButton')}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                {t('backToSignIn')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
