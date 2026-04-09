'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CommandLineIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import SocialIcon from '@/components/ui/SocialIcon'
import RoadmapItem from '@/components/ui/RoadmapItem'
import Footer from '@/components/Footer'

export default function Home() {
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Simplified navigation for the landing page
  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ]

  const faqs = [
    {
      question: "How does the token-based pricing work?",
      answer: "Instead of a monthly subscription, you purchase credits (tokens). Each AI analysis consumes a specific amount of tokens based on the complexity and model used. You only pay for what you actually use, with 30 free tokens to get you started."
    },
    {
      question: "Is my resume data secure?",
      answer: "Absolutely. We use enterprise-grade encryption and never share your data with third parties. You can delete your resumes and analysis history at any time from your dashboard."
    },
    {
      question: "What makes Haku different from other ATS tools?",
      answer: "Most tools just search for keywords. Haku uses advanced LLMs to understand the semantic intent of your experience and how it aligns with specific job requirements, providing much deeper insights than a standard keyword matcher."
    },
    {
      question: "Can I use Haku for different languages?",
      answer: "Currently, we are optimized for English, but our AI models support multiple languages. You can upload resumes in various languages, though the structured matching feedback is currently focused on English markets."
    }
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
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
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">v1.0 Now Live</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Land your dream job with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">AI Intelligence.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                The most advanced AI-powered job search suite. Optimize resumes, generate cover letters, and track applications with real-time token-based intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href={user ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 flex items-center justify-center group"
                >
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                  <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center"
                >
                  Watch Demo
                </Link>
              </div>
              {/* <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-slate-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"></div>
                  ))}
                </div>
                <p className="text-sm font-medium">Joined by <span className="text-slate-900 font-bold">10,000+</span> professionals</p>
              </div> */}
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
                    alt="Dashboard Mockup" 
                    width={800} 
                    height={600} 
                    className="w-full h-auto"
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
      <section className="py-12 border-y border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 lg:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <span className="text-xl font-black tracking-tighter text-slate-900">MICROSOFT</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">GOOGLE</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">AMAZON</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">META</span>
          <span className="text-xl font-black tracking-tighter text-slate-900">NETFLIX</span>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4">Core Engine</h2>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Intelligence in every step of your journey.
            </h3>
            <p className="text-lg text-slate-500">
              Our AI engine processes thousands of data points to ensure your application stands out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CpuChipIcon className="h-7 w-7" />}
              title="Advanced Analysis"
              description="Deep-learning scanning that identifies semantic gaps in your experience for targeted roles."
              color="indigo"
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="h-7 w-7" />}
              title="ATS Shield"
              description="Built-in scoring that mimics modern Applicant Tracking Systems used by top Fortune 500 companies."
              color="emerald"
            />
            <FeatureCard 
              icon={<CommandLineIcon className="h-7 w-7" />}
              title="Token-Based Precision"
              description="Pay only for the intelligence you use. Flexible consumption model that scales with your needs."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 rounded-[4rem] mx-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Three steps to success</h2>
            <p className="text-slate-500">Streamlining your path from application to offer.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10"></div>
            
            <StepItem 
              number="01"
              title="Upload & Sync"
              description="Simply drop your PDF or Word document. We extract metadata and text automatically."
            />
            <StepItem 
              number="02"
              title="AI Deep Scan"
              description="Target a specific job and let our algorithm identify the perfect alignment strategy."
            />
            <StepItem 
              number="03"
              title="Review & Optimize"
              description="View detailed historical reports and tweak your resume until you hit the 90+ score mark."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section (Pay-as-you-go) */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-12 lg:p-16 bg-slate-50/50">
                <h3 className="text-3xl font-black text-slate-900 mb-6">Pay-as-you-go Pricing</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  No monthly subscriptions. No hidden fees. We believe in fair, usage-based access to the world's most powerful AI models.
                </p>
                <div className="space-y-4 mb-10">
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text="Unlimited Resume Storage" />
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text="Real-time Application Tracking" />
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text="Detailed Historical Analysis" />
                  <PricingDetail icon={<CheckCircleIcon className="h-5 w-5 text-emerald-500" />} text="ATS Compatibility Scoring" />
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                >
                  Create free account to view detailed rates
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left bg-white border-l border-slate-100">
                <div className="mb-8">
                  <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Transparency First</span>
                  <p className="text-4xl font-black text-slate-900 mt-2">Intelligence on Demand</p>
                </div>
                <div className="space-y-6 w-full">
                  <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-left">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Token System</p>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      We charge based on actual token consumption. You pay the direct model cost with a small processing margin. Total transparency, absolute control.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                       <SparklesIcon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">Start for free</p>
                      <p className="text-sm text-slate-500">Every new user gets 30 complimentary tokens.</p>
                    </div>
                  </div>
                  <Link
                    href="/register"
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all text-center block"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-24 bg-slate-900 text-white rounded-[4rem] mx-4 mb-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
           <CommandLineIcon className="h-96 w-96 transform rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-indigo-400 font-black tracking-widest uppercase text-sm mb-4">The Future</h2>
              <h3 className="text-4xl font-extrabold tracking-tight mb-8">What's coming next?</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                We are building the end-to-end recruitment bridge. Our upcoming features will close the gap between job seekers and elite recruiters.
              </p>
              <div className="space-y-6">
                 <RoadmapItem
                   title="AI Resume Engine" 
                   description="Instant CV generation based on your target job and personal background." 
                   status="Q3 2026"
                 />
                 <RoadmapItem
                   title="Recruiter ATS Matching" 
                   description="A portal for headhunters to find candidates based on AI-verified skill alignment." 
                   status="Q4 2026"
                 />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
      <section id="faq" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4">Support</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Common Questions</h3>
            <p className="text-slate-500">Everything you need to know about the Haku platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-indigo-100 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between group"
                >
                  <span className={`font-bold transition-colors ${openFaq === index ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                    {faq.question}
                  </span>
                  <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-indigo-500' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          
          {/* <div className="mt-16 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
               <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-indigo-600" />
               </div>
               <div className="text-center sm:text-left">
                  <p className="font-bold text-slate-900">Still have questions?</p>
                  <p className="text-sm text-slate-500">We're here to help you land that role.</p>
               </div>
            </div>
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              Contact Support
            </Link>
          </div> */}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
  const colorMap: any = {
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

function PricingDetail({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-slate-600 font-medium">{text}</span>
    </div>
  )
}
