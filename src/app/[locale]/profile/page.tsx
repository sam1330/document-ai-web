'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import {
  UserIcon,
  CreditCardIcon,
  ChartBarIcon,
  ArrowUpCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  WalletIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, Button, Checkbox, Select } from '@/components/ui'
import { useTranslations } from 'next-intl'
import { useCredits } from '@/contexts/CreditContext'
import api from '@/lib/api'

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
  const t = useTranslations()
  const { user, updateProfile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const [isUpdating, setIsUpdating] = useState(false)
  const { balance } = useCredits()

  const { register: registerProfile, handleSubmit: handleProfileSubmit, reset: resetProfile, formState: { errors: profileErrors } } = useForm<ProfileForm>()
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, watch, formState: { errors: passwordErrors } } = useForm<PasswordForm>()

  const newPassword = watch('new_password')

  const handleAddCreditsClick = async (planName: string) => {
    try {
      const response = await api.post('/api/credits/create-checkout-session', { plan_name: planName })

      const { url } = response.data
      window.location.href = url;
    } catch (error) {
      console.error('Failed to add credits:', error)
    }
  }

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
      toast.success(t('profile.account.updateSuccess'))
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('profile.account.updateFailed'))
    } finally {
      setIsUpdating(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsUpdating(true)
    try {
      toast.success(t('profile.security.passwordUpdateSuccess'))
      resetPassword()
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('profile.security.passwordUpdateFailed'))
    } finally {
      setIsUpdating(false)
    }
  }

  const formatUsedCredits = (usage: number) => {
    if (usage < 1000) return usage
    if (usage < 1000000) return (usage / 1000).toFixed(1) + 'k'
    return (usage / 1000000).toFixed(1) + 'M'
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50/50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-slate-200 rounded-[2.5rem] w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1 h-64 bg-slate-200 rounded-3xl"></div>
                <div className="md:col-span-3 h-96 bg-slate-200 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!user) return null

  const tabs = [
    { id: 'account', name: t('profile.tabs.account'), icon: UserIcon },
    { id: 'credits', name: t('profile.tabs.creditsBilling'), icon: WalletIcon },
    { id: 'security', name: t('profile.tabs.security'), icon: ShieldCheckIcon },
    { id: 'preferences', name: t('profile.tabs.preferences'), icon: BellIcon },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <Navigation />

        <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm mb-10 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <UserIcon className="h-40 w-40" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-100 ring-4 ring-white">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                  <p className="text-slate-500 font-medium">{user.email}</p>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {t('profile.header.accountActive')}
                  </span>
                </div>
              </div>
              <div className="md:ml-auto flex items-center bg-slate-50 p-4 rounded-3xl border border-slate-100 space-x-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('profile.header.creditsBought')}</p>
                  <p className="text-xl font-black text-slate-900">{user?.total_spent?.toLocaleString()}</p>
                </div>
                <div className="h-10 border-l border-slate-200"></div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('profile.header.usagePerMonth')}</p>
                  <p className="text-xl font-black text-slate-900">{formatUsedCredits(Math.abs(user.credits_used_last_month))}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Tabs */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-[2rem] border border-slate-200 p-2 shadow-sm sticky top-10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all font-bold my-1 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                    <span className="text-sm">{tab.name}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Main Panel */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 md:p-10"
                >
                  {/* Account Tab */}
                  {activeTab === 'account' && (
                    <div className="space-y-10">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">{t('profile.account.title')}</h2>
                        <p className="text-sm text-slate-500 font-medium">{t('profile.account.subtitle')}</p>
                      </div>

                      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            {...registerProfile('first_name', { required: t('profile.account.firstNameRequired') })}
                            label={t('profile.account.firstName')}
                            placeholder={t('profile.account.firstNamePlaceholder')}
                            error={profileErrors.first_name?.message}
                          />
                          <Input
                            {...registerProfile('last_name', { required: t('profile.account.lastNameRequired') })}
                            label={t('profile.account.lastName')}
                            placeholder={t('profile.account.lastNamePlaceholder')}
                            error={profileErrors.last_name?.message}
                          />
                        </div>
                        <Input
                          {...registerProfile('email', { required: t('profile.account.emailRequired') })}
                          label={t('profile.account.emailAddress')}
                          type="email"
                          placeholder={t('profile.account.emailPlaceholder')}
                          error={profileErrors.email?.message}
                        />
                        <div className="flex justify-end pt-4">
                          <Button type="submit" loading={isUpdating} className="rounded-2xl px-10 bg-indigo-600 shadow-lg shadow-indigo-50">
                            {t('common.saveChanges')}
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Credits & Billing Tab */}
                  {activeTab === 'credits' && (
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">{t('profile.credits.title')}</h2>
                          <p className="text-sm text-slate-500 font-medium">{t('profile.credits.subtitle')}</p>
                        </div>
                        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100">
                          <SparklesIcon className="h-4 w-4" />
                          <span className="text-xs font-black uppercase tracking-widest">{t('profile.credits.activeBalance')}</span>
                        </div>
                      </div>

                      {/* Token Chart & Usage */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 flex flex-col items-center justify-center">
                          {/* <div className="relative h-40 w-40 flex items-center justify-center mb-6">
                                          <svg className="h-full w-full transform -rotate-90">
                                             <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                                             <circle
                                                cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray={465}
                                                strokeDashoffset={465 - (465 * 75) / 100}
                                                className="text-indigo-600"
                                             />
                                          </svg>
                                          <div className="absolute flex flex-col items-center">
                                             <span className="text-2xl font-black text-slate-900">75%</span>
                                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('profile.credits.monthlyQuota')}</span>
                                          </div>
                                       </div> */}
                          <h3 className="text-4xl font-black text-slate-900 mb-2">{balance.toLocaleString()}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('profile.credits.availableCredits')}</p>
                        </div>
                      </div>

                      {/* Buy Credits */}
                      <div className="space-y-6 pt-6">
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">{t('profile.credits.addCredits')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { name: t('profile.credits.packages.starter'), price: '$10', tokens: '100', color: 'indigo', planName: 'starter' },
                            { name: t('profile.credits.packages.grow'), price: '$20', tokens: '200', color: 'violet', planName: 'grow', recommended: true },
                            { name: t('profile.credits.packages.power'), price: '$50', tokens: '500', color: 'slate', planName: 'power' },
                          ].map((pkg) => (
                            <div key={pkg.name} onClick={() => handleAddCreditsClick(pkg.planName)} className={`relative p-6 rounded-3xl border-2 transition-all group cursor-pointer hover:shadow-xl ${pkg.recommended ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 hover:border-indigo-200'}`}>
                              {pkg.recommended && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{t('profile.credits.packages.recommended')}</span>
                              )}
                              <p className="text-xs font-bold text-slate-400 mb-1">{pkg.name}</p>
                              <p className="text-2xl font-black text-slate-900 mb-4">{pkg.tokens}</p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-sm font-black text-slate-600">{pkg.price}</span>
                                <button className={`p-2 rounded-xl transition-all ${pkg.recommended ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-400 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                                  <ArrowUpCircleIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transactions */}
                      <div className="pt-6">
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">{t('profile.credits.recentActivity')}</h3>
                        <div className="space-y-4">
                          {user.recent_transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-3xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
                              <div className="flex items-center space-x-4">
                                <div className={`p-2.5 rounded-2xl ${tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                                  {tx ? <CreditCardIcon className="h-5 w-5" /> : <ChartBarIcon className="h-5 w-5" />}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{new Date(tx.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                              <span className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                                {tx.amount.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-10">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">{t('profile.security.title')}</h2>
                        <p className="text-sm text-slate-500 font-medium">{t('profile.security.subtitle')}</p>
                      </div>

                      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                        <Input
                          {...registerPassword('current_password', { required: t('profile.security.required') })}
                          label={t('profile.security.currentPassword')}
                          type="password"
                          placeholder={t('profile.security.currentPasswordPlaceholder')}
                          error={passwordErrors.current_password?.message}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input
                            {...registerPassword('new_password', { required: t('profile.security.required'), minLength: { value: 8, message: t('profile.security.passwordMinLength') } })}
                            label={t('profile.security.newPassword')}
                            type="password"
                            placeholder={t('profile.security.newPasswordPlaceholder')}
                            error={passwordErrors.new_password?.message}
                          />
                          <Input
                            {...registerPassword('confirm_password', { required: t('profile.security.required'), validate: v => v === newPassword || t('profile.security.passwordMismatch') })}
                            label={t('profile.security.confirmNewPassword')}
                            type="password"
                            placeholder={t('profile.security.confirmNewPasswordPlaceholder')}
                            error={passwordErrors.confirm_password?.message}
                          />
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button type="submit" loading={isUpdating} className="rounded-2xl px-10 bg-indigo-600 shadow-lg shadow-indigo-50">
                            {t('profile.security.updatePassword')}
                          </Button>
                        </div>
                      </form>

                      <div className="pt-10 border-t border-slate-100">
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-6">{t('profile.security.dangerZone')}</h3>
                        <div className="p-6 rounded-3xl border border-rose-100 bg-rose-50/30 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <p className="text-sm font-bold text-rose-900">{t('profile.security.deleteAccount.title')}</p>
                            <p className="text-xs text-rose-600 font-medium">{t('profile.security.deleteAccount.description')}</p>
                          </div>
                          <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl">
                            {t('profile.security.deleteAccount.buttonText')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === 'preferences' && (
                    <div className="space-y-10">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-2">{t('profile.preferences.title')}</h2>
                        <p className="text-sm text-slate-500 font-medium">Customize your dashboard experience and notifications.</p>
                      </div>

                      <div className="space-y-10">
                        <div className="space-y-4">
                          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">{t('profile.preferences.emailNotifications')}</h3>
                          <div className="space-y-3">
                            <Checkbox id="notif-1" label={t('profile.preferences.notifications.analysisComplete')} defaultChecked />
                            <Checkbox id="notif-2" label={t('profile.preferences.notifications.weeklyDigest')} defaultChecked />
                            <Checkbox id="notif-3" label={t('profile.preferences.notifications.lowCreditAlert')} defaultChecked />
                          </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-slate-100">
                          <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">{t('profile.preferences.systemLanguage')}</h3>
                          <div className="max-w-xs">
                            <Select
                              options={[
                                { value: 'en', label: t('profile.preferences.languages.english') },
                                { value: 'es', label: t('profile.preferences.languages.spanish') },
                                { value: 'fr', label: t('profile.preferences.languages.french') }
                              ]}
                              defaultValue="en"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
