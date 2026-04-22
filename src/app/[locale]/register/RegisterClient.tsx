'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline'
import { Input, Button, Checkbox } from '@/components/ui'
import toast from 'react-hot-toast'
import { useTranslations } from 'next-intl'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterClient() {
  const t = useTranslations()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const { executeRecaptcha } = useGoogleReCaptcha()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      let recaptchaToken = ''
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha('register')
      }

      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        recaptcha_token: recaptchaToken,
      })
      toast.success(t('auth.accountCreatedSuccess'))
      router.push(`/email-verification?email=${encodeURIComponent(data.email)}`)
    } catch (error: any) {
      const code = error.response?.data?.code
      if (code === 'USER_EXISTS') {
        toast.error(error.response?.data?.error || t('auth.userExistsError'))
      } else {
        toast.error(error.response?.data?.message || t('auth.registrationFailed'))
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('auth.createYourAccount')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.getStartedWithHaku')}{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {t('auth.signInToExistingAccount')}
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('first_name', { required: t('auth.firstNameRequired') })}
                type="text"
                label={t('auth.firstName')}
                placeholder={t('auth.firstNamePlaceholder')}
                leftIcon={<UserIcon />}
                error={errors.first_name?.message}
                autoComplete="given-name"
              />
              <Input
                {...register('last_name', { required: t('auth.lastNameRequired') })}
                type="text"
                label={t('auth.lastName')}
                placeholder={t('auth.lastNamePlaceholder')}
                leftIcon={<UserIcon />}
                error={errors.last_name?.message}
                autoComplete="family-name"
              />
            </div>

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
              {...register('password', {
                required: t('auth.passwordRequired'),
                minLength: {
                  value: 8,
                  message: t('auth.passwordMinLength')
                }
              })}
              type={showPassword ? 'text' : 'password'}
              label={t('auth.password')}
              placeholder={t('auth.createPassword')}
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
                required: t('auth.confirmPasswordRequired'),
                validate: value => value === password || t('auth.passwordsDoNotMatch')
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              label={t('auth.confirmPassword')}
              placeholder={t('auth.confirmPasswordPlaceholder')}
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

            <Checkbox
              id="agree-terms"
              name="agree-terms"
              required
              label={
                <span>
                  {t('auth.agreeToTerms')}{' '}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    {t('auth.termsOfService')}
                  </Link>{' '}
                  {t('common.and')}{' '}
                  <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    {t('auth.privacyPolicy')}
                  </Link>
                </span>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? t('auth.creatingAccount') : t('auth.createAccountButton')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
