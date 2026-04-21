'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline'
import { Input, Button } from '@/components/ui'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

interface ResetPasswordForm {
  password: string
  confirmPassword: string
}

export default function ResetPasswordClient() {
  const t = useTranslations('auth.resetPasswordPage')
  const searchParams = useSearchParams()
  const router = useRouter()
  const { resetPassword } = useAuth()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>()
  const password = watch('password')

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error(t('missingToken'))
      return
    }

    try {
      await resetPassword(token, data.password)
      toast.success(t('successToast'))
      router.push('/login?password-reset=true')
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error
      toast.error(message || t('errorToast'))
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">{t('invalidLink')}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('invalidOrExpired')}
            </p>
            <Link href="/forgot-password" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
              {t('requestNewLink')}
            </Link>
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
            <KeyIcon className="h-10 w-10 text-indigo-600" aria-hidden="true" />
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
              {...register('password', {
                required: t('newPassword'),
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              label={t('newPassword')}
              placeholder={t('newPasswordPlaceholder')}
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
              autoComplete="new-password"
            />

            <Input
              {...register('confirmPassword', {
                required: t('confirmNewPassword'),
                validate: value => value === password || 'Passwords do not match'
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              label={t('confirmNewPassword')}
              placeholder={t('confirmNewPasswordPlaceholder')}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              }
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? t('resetting') : t('resetButton')}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {t('backToSignIn')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
