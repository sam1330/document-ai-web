'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { Input, Button, Checkbox } from '@/components/ui'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const t = useTranslations()

  const [showPassword, setShowPassword] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const { login } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      toast.success(t('auth.toast.signInSuccess'))
      router.push('/dashboard')
    } catch (error: any) {
      const code = error.response?.data?.code
      if (code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(data.email)
        toast.error(error.response?.data?.error || t('auth.pleaseVerifyEmail'))
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || t('auth.loginFailed'))
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {t('auth.welcomeBack')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.rich('auth.signInSubHeader', {
              customLink: (chunks) => (
                <Link
                  href="/register"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  {chunks}
                </Link>
              )
            })}
          </p>
        </div>

        {unverifiedEmail && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  {t('auth.emailNotVerified')}
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    {t('auth.emailNotVerifiedMessage', { email: unverifiedEmail })}
                  </p>
                </div>
                <div className="mt-3 space-x-3">
                  <Link
                    href={`/email-verification?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="text-sm font-medium text-yellow-800 hover:text-yellow-700 underline"
                  >
                    {t('auth.resendVerificationEmail')}
                  </Link>
                  <button
                    onClick={() => setUnverifiedEmail('')}
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
                  >
                    {t('auth.dismiss')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('email', {
                required: t('auth.emailRequired'),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t('auth.invalidEmail')
                }
              })}
              type="email"
              label={t('auth.emailAddress')}
              placeholder={t('auth.emailPlaceholder')}
              leftIcon={<EnvelopeIcon />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <Input
              {...register('password', { required: t('auth.passwordRequired') })}
              type={showPassword ? 'text' : 'password'}
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              }
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <Checkbox
                id="remember-me"
                name="remember-me"
                label={t('auth.rememberMe')}
              />
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? t('auth.signingIn') : t('auth.signInButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
