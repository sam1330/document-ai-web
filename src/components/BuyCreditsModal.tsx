'use client'

import { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { XMarkIcon, ArrowUpCircleIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import api from '@/lib/api'

interface BuyCreditsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const t = useTranslations()

  const handleAddCreditsClick = async (planName: string) => {
    try {
      const response = await api.post('/api/credits/create-checkout-session', { plan_name: planName })
      const { url } = response.data
      window.location.href = url
    } catch (error) {
      console.error('Failed to add credits:', error)
    }
  }

  const packages = [
    { name: t('profile.credits.packages.starter'), price: '$10', tokens: '100', planName: 'starter' },
    { name: t('profile.credits.packages.professional'), price: '$20', tokens: '250', planName: 'professional', recommended: true },
    { name: t('profile.credits.packages.business'), price: '$50', tokens: '650', planName: 'business' },
  ]

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <SparklesIcon className="h-5 w-5 text-indigo-600" />
                      <DialogTitle as="h3" className="text-lg font-black text-slate-900 tracking-tight">
                        {t('buyCredits.modalTitle')}
                      </DialogTitle>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{t('buyCredits.modalSubtitle')}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-xl transition-all"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.planName}
                      onClick={() => handleAddCreditsClick(pkg.planName)}
                      className={`relative p-5 rounded-2xl border-2 transition-all group cursor-pointer hover:shadow-xl ${
                        pkg.recommended
                          ? 'border-indigo-600 bg-indigo-50/30'
                          : 'border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      {pkg.recommended && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                          {t('profile.credits.packages.recommended')}
                        </span>
                      )}
                      <p className="text-xs font-bold text-slate-400 mb-1">{pkg.name}</p>
                      <p className="text-2xl font-black text-slate-900 mb-4">{pkg.tokens}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm font-black text-slate-600">{pkg.price}</span>
                        <button
                          className={`p-2 rounded-xl transition-all ${
                            pkg.recommended
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                              : 'bg-white text-slate-400 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white'
                          }`}
                        >
                          <ArrowUpCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                  <InformationCircleIcon className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-emerald-700">{t('buyCredits.disclaimer')}</p>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
