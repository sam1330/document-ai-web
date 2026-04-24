'use client'

import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { InformationCircleIcon, SparklesIcon, DocumentTextIcon, BoltIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'

const RATES = [
  { credits: 15, labelKey: 'deepScan', icon: SparklesIcon, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
  { credits: 5, labelKey: 'coverLetter', icon: DocumentTextIcon, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  { credits: 1, labelKey: 'bulletEnhance', icon: BoltIcon, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
]

export default function CreditUtilityGuide() {
  const t = useTranslations('landing.pricing.creditGuide')

  return (
    <Popover className="relative inline-flex">
      <PopoverButton className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none group">
        <InformationCircleIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
        {t('trigger')}
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <PopoverPanel className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 w-72">
          <div className="bg-white rounded-2xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('title')}
              </p>
            </div>
            {/* Rows */}
            <div className="p-3 space-y-2">
              {RATES.map(({ credits, labelKey, icon: Icon, color, bg }) => (
                <div
                  key={labelKey}
                  className={`flex items-center justify-between p-3 rounded-xl border ${bg}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="text-sm font-semibold text-slate-700">
                      {t(labelKey as any)}
                    </span>
                  </div>
                  <span className={`text-sm font-black ${color}`}>
                    {credits} cr.
                  </span>
                </div>
              ))}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 -translate-y-1.5" />
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}
