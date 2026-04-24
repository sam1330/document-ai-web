'use client'

import { EyeIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

interface RecruiterFeedbackCardProps {
  feedback?: string[]
}

export default function RecruiterFeedbackCard({ feedback }: RecruiterFeedbackCardProps) {
  const t = useTranslations('resumeDetail.recruiterFeedback')
  const hasFeedback = feedback && feedback.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-slate-900 rounded-3xl shadow-sm border border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <EyeIcon className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white">{t('title')}</h3>
        </div>
        <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
          {t('badge')}
        </span>
      </div>

      {/* Body */}
      <div className="p-6">
        {hasFeedback ? (
          <>
            <ul className="space-y-4">
              {feedback.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed">{point}</p>
                </li>
              ))}
            </ul>
            {/* Disclaimer */}
            <div className="mt-5 pt-4 border-t border-slate-700/60">
              <p className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                <SparklesIcon className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-slate-600" />
                {t('disclaimer')}
              </p>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <EyeIcon className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-500">
              {t('emptyState')}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
