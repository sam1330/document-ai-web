'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline'
import { Input, Button, Checkbox } from '@/components/ui'
import toast from 'react-hot-toast'

interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>()

  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
      })
      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started with CvEnhance or{' '}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                {...register('first_name', { required: 'First name is required' })}
                type="text"
                label="First name"
                placeholder="Enter your first name"
                leftIcon={<UserIcon />}
                error={errors.first_name?.message}
                autoComplete="given-name"
              />
              <Input
                {...register('last_name', { required: 'Last name is required' })}
                type="text"
                label="Last name"
                placeholder="Enter your last name"
                leftIcon={<UserIcon />}
                error={errors.last_name?.message}
                autoComplete="family-name"
              />
            </div>

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

            <Input
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Create a password"
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
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm password"
              placeholder="Confirm your password"
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
                  I agree to the{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    Privacy Policy
                  </a>
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
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
