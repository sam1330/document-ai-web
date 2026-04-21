'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import {
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Image from 'next/image'
import RoadmapItem from '@/components/ui/RoadmapItem'
import Footer from '@/components/Footer'
import Faq from '@/components/Faq'
import { JsonLd } from '@/components/seo/JsonLd'

export default function HomeClient() {
  const t = useTranslations()
  const { user } = useAuth()

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Haku',
    url: 'https://haku-ai.com',
    logo: 'https://haku-ai.com/images/logo.png',
    description: t('seo.home.description'),
    sameAs: [],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Haku',
    url: 'https://haku-ai.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://haku-ai.com/en/register',
      'query-input': 'required name=search_term_string',
    },
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Haku',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: t('landing.pricing.sectionSubtitle'),
    },
    description: t('seo.home.description'),
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />

      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-50 rounded-full blur-[100px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{t('landing.hero.badge')}</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                {t.rich('landing.hero.title', {
                  aiIntelligence: () => (
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                      {t('landing.hero.aiIntelligence')}
                    </span>
                  )
                })}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                {t('landing.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 flex items-center justify-center group"
                >
                  {user ? t('landing.common.goToDashboard') : t('landing.common.getStartedFree')}
                  <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center"
                >
                  {t('landing.common.watchDemo')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200 border border-slate-200 bg-white">
                 <Image
                    src="/images/hero-mockup.png"
                    alt="Haku AI resume analysis dashboard"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                 />
              </div>
              {/* Floating Decorative Elements */}
              <div className="absolute -top-6 -right-6 h-24 w-24 bg-indigo-100 rounded-3xl -z-10 animate-blob"></div>
              <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-purple-100 rounded-full -z-10 animate-blob animation-delay-2000"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/30" aria-label="Trusted by professionals at top companies">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xl font-black tracking-tighter text-slate-900">{t('landing.trust.companies.microsoft')}</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">{t('landing.trust.companies.google')}</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">{t('landing.trust.companies.amazon')}</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">{t('landing.trust.companies.meta')}</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">{t('landing.trust.companies.netflix')}</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 id="features-heading" className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4">{t('landing.features.sectionTitle')}</h2>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {t('landing.features.sectionSubtitle')}
            </h3>
            <p className="text-lg text-slate-500">
              {t('landing.features.sectionDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CpuChipIcon className="h-7 w-7" />}
              title={t('landing.features.advancedAnalysis.title')}
              description={t('landing.features.advancedAnalysis.description')}
              color="indigo"
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="h-7 w-7" />}
              title={t('landing.features.atsShield.title')}
              description={t('landing.features.atsShield.description')}
              color="emerald"
            />
            <FeatureCard
              icon={<CommandLineIcon className="h-7 w-7" />}
              title={t('landing.features.tokenPrecision.title')}
              description={t('landing.features.tokenPrecision.description')}
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 rounded-[4rem] mx-4" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">{t('landing.howItWorks.sectionTitle')}</h2>
            <p className="text-slate-500">{t('landing.howItWorks.sectionSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>

            <StepItem
              number={t('landing.howItWorks.steps.step1.number')}
              title={t('landing.howItWorks.steps.step1.title')}
              description={t('landing.howItWorks.steps.step1.description')}
            />
            <StepItem
              number={t('landing.howItWorks.steps.step2.number')}
              title={t('landing.howItWorks.steps.step2.title')}
              description={t('landing.howItWorks.steps.step2.description')}
            />
            <StepItem
              number={t('landing.howItWorks.steps.step3.number')}
              title={t('landing.howItWorks.steps.step3.title')}
              description={t('landing.howItWorks.steps.step3.description')}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section (Pay-as-you-go) */}
      <section id="pricing" className="py-24 lg:py-32" aria-labelledby="pricing-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-16 bg-slate-50/50">
                <h2 id="pricing-heading" className="text-3xl font-black text-slate-900 mb-6">{t('landing.pricing.sectionTitle')}</h2>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {t('landing.pricing.sectionSubtitle')}
                </p>
                <div className="space-y-4 mb-10">
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text={t('landing.pricing.features.unlimitedStorage')} />
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text={t('landing.pricing.features.realTimeTracking')} />
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text={t('landing.pricing.features.historicalAnalysis')} />
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text={t('landing.pricing.features.atsScoring')} />
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                  {t('landing.pricing.viewRates')}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-white border-l border-slate-100">
                <div className="mb-8">
                  <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">{t('landing.pricing.transparencyFirst')}</span>
                  <p className="text-4xl font-black text-slate-900 mt-2">{t('landing.pricing.intelligenceOnDemand')}</p>
                </div>
                <div className="space-y-6 w-full">
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-left">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{t('landing.pricing.tokenSystem.title')}</p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {t('landing.pricing.tokenSystem.description')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                       <SparklesIcon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">{t('landing.pricing.startFree.title')}</p>
                      <p className="text-sm text-slate-500">{t('landing.pricing.startFree.description')}</p>
                    </div>
                  </div>
                  <Link
                    href="/register"
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-center block"
                  >
                    {t('landing.common.startFreeTrial')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative" aria-labelledby="roadmap-heading">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
           <CommandLineIcon className="h-96 w-96 transform rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 id="roadmap-heading" className="text-indigo-400 font-black tracking-widest uppercase text-sm mb-4">{t('landing.roadmap.sectionTitle')}</h2>
              <h3 className="text-4xl font-extrabold tracking-tight mb-8">{t('landing.roadmap.sectionSubtitle')}</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                {t('landing.roadmap.sectionDescription')}
              </p>
              <div className="space-y-6">
                 <RoadmapItem
                   title={t('landing.roadmap.items.aiResumeEngine.title')}
                   description={t('landing.roadmap.items.aiResumeEngine.description')}
                   status={t('landing.roadmap.items.aiResumeEngine.status')}
                 />
                 <RoadmapItem
                   title={t('landing.roadmap.items.recruiterAts.title')}
                   description={t('landing.roadmap.items.recruiterAts.description')}
                   status={t('landing.roadmap.items.recruiterAts.status')}
                 />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4" aria-hidden="true">
              <div className="space-y-4 pt-12">
                 <div className="bg-slate-800 p-6 rounded-3xl h-48 flex items-end">
                    <UserGroupIcon className="h-10 w-10 text-indigo-400" />
                 </div>
                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl h-64"></div>
              </div>
              <div className="space-y-4">
                 <div className="bg-slate-800 p-6 rounded-3xl h-64 flex items-start">
                    <AcademicCapIcon className="h-10 w-10 text-purple-400" />
                 </div>
                 <div className="bg-slate-700 p-6 rounded-3xl h-48"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Faq />

      {/* Footer */}
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl border border-slate-200 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300"
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border mb-6 ${colorMap[color] || colorMap.indigo}`}>
        {icon}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  )
}

function StepItem({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 relative group">
      <div className="text-5xl font-black text-slate-100 mb-4 group-hover:text-indigo-50 transition-colors">
        {number}
      </div>
      <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function PricingDetail({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-slate-600 font-medium">{text}</span>
    </div>
  )
}
