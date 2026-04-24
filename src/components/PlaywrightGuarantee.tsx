'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ShieldCheckIcon, DocumentTextIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

const PROOF_ICONS = [ShieldCheckIcon, DocumentTextIcon, ComputerDesktopIcon]

export default function PlaywrightGuarantee() {
  const t = useTranslations('landing.playwrightGuarantee')

  const proofs = (['1', '2', '3'] as const).map((n, i) => ({
    icon: PROOF_ICONS[i],
    title: t(`proof${n}.title` as any),
    description: t(`proof${n}.description` as any),
  }))

  return (
    <section
      id="playwright-guarantee"
      className="py-24 bg-slate-900 rounded-[4rem] mx-4 overflow-hidden relative"
      aria-labelledby="playwright-heading"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[36rem] h-[36rem] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] bg-violet-600/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-indigo-400 font-black uppercase tracking-widest text-sm mb-4 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full">
            {t('badge')}
          </span>
          <h2 id="playwright-heading" className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            {t('headline')}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            {t('body')}
          </p>
        </div>

        {/* Proof point cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proofs.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-8 transition-all duration-300"
            >
              {/* Number label */}
              <div className="absolute top-6 right-6 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors select-none">
                {String(i + 1).padStart(2, '0')}
              </div>
              {/* Icon */}
              <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <Icon className="h-6 w-6 text-indigo-400" />
              </div>
              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-14 pt-10 border-t border-white/10 flex flex-wrap items-center justify-center gap-8">
          {[
            { label: 'Built with Playwright', sub: 'Chromium headless engine' },
            { label: 'Zero client-side rendering', sub: 'Server-generated PDFs' },
            { label: 'UTF-8 + embedded fonts', sub: 'Full ATS character support' },
          ].map(({ label, sub }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-bold text-white">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
