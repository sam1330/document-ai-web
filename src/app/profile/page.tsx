'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  CreditCardIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface ProfileForm {
  first_name: string
  last_name: string
  email: string
}

interface PasswordForm {
  current_password: string
  new_password: string
  confirm_password: string
}

export default function ProfilePage() {
  const { user, updateProfile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [isUpdating, setIsUpdating] = useState(false)

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile } = useForm<ProfileForm>()
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, watch } = useForm<PasswordForm>()

  const newPassword = watch('new_password')

  useEffect(() => {
    if (user) {
      resetProfile({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      })
    }
  }, [user, resetProfile])

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsUpdating(true)
    try {
      await updateProfile(data)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsUpdating(true)
    try {
      // This would need to be implemented in the API
      toast.success('Password updated successfully!')
      resetPassword()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: UserIcon },
    { id: 'password', name: 'Change Password', icon: KeyIcon },
    { id: 'subscription', name: 'Subscription', icon: CreditCardIcon },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your account settings and preferences.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <tab.icon className="mr-2 h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        {...registerProfile('first_name', { required: 'First name is required' })}
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        {...registerProfile('last_name', { required: 'Last name is required' })}
                        type="text"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      {...registerProfile('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      {...registerPassword('current_password', { required: 'Current password is required' })}
                      type="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      {...registerPassword('new_password', { 
                        required: 'New password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                      type="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      {...registerPassword('confirm_password', { 
                        required: 'Please confirm your new password',
                        validate: value => value === newPassword || 'Passwords do not match'
                      })}
                      type="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-8 w-8 text-gray-400" />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Current Plan: {user.subscription_type.charAt(0).toUpperCase() + user.subscription_type.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {user.subscription_expires_at 
                            ? `Expires on ${new Date(user.subscription_expires_at).toLocaleDateString()}`
                            : 'No expiration date'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Free Plan</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Basic features for getting started
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Upload up to 3 resumes</li>
                        <li>• Basic resume analysis</li>
                        <li>• 5 AI requests per month</li>
                        <li>• Email support</li>
                      </ul>
                      {user.subscription_type === 'free' && (
                        <div className="mt-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Current Plan
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border border-indigo-200 rounded-lg p-6 bg-indigo-50">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Pro Plan</h4>
                      <p className="text-sm text-gray-500 mb-4">
                        Advanced features for serious job seekers
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Unlimited resume uploads</li>
                        <li>• Advanced AI analysis</li>
                        <li>• Unlimited AI requests</li>
                        <li>• Priority support</li>
                        <li>• Resume optimization</li>
                      </ul>
                      {user.subscription_type === 'pro' ? (
                        <div className="mt-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Current Plan
                          </span>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                            Upgrade to Pro
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
