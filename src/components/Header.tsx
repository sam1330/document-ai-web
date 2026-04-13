'use client'

import { useState, Fragment } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  SparklesIcon,
  CpuChipIcon,
  ClockIcon,
  MapIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { Menu, Transition, Popover, PopoverButton, PopoverPanel, MenuButton, MenuItems, MenuItem, PopoverGroup } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslations } from 'next-intl'

export default function Header() {
  const t = useTranslations()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const resumeFeatures = [
  {
    name: t('landing.header.resume.aiResumeAnalysis'),
    description: t('landing.header.resume.aiResumeAnalysisDescription'),
    href: '/resumes',
    icon: SparklesIcon,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    name: t('landing.header.resume.ats'),
    description: t('landing.header.resume.atsDescription'),
    href: '/resumes',
    icon: CpuChipIcon,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    name: t('landing.header.resume.history'),
    description: t('landing.header.resume.historyDescription'),
    href: '/resumes',
    icon: ClockIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
]

const resourceLinks = [
  { name: 'Project Roadmap', href: '#roadmap', icon: MapIcon },
  { name: 'Support FAQ', href: '#faq', icon: QuestionMarkCircleIcon },
  { name: 'Community', href: '#', icon: UserGroupIcon },
]

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">
                HAKU<span className="text-indigo-600">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <PopoverGroup className="flex items-center space-x-8">
              
              {/* Resume Mega Menu */}
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <PopoverButton className={`group flex items-center space-x-1 outline-none text-[17px] font-medium transition-colors ${open ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
                      <span>{t('landing.header.resume.title')}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                    </PopoverButton>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                        <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-2xl ring-1 ring-slate-900/5">
                          <div className="p-4">
                            {resumeFeatures.map((item) => (
                              <div key={item.name} className="group relative flex gap-x-6 rounded-2xl p-4 hover:bg-slate-50 transition-colors">
                                <div className={`mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm group-hover:border-transparent group-hover:shadow-none transition-all ${item.bgColor}`}>
                                  <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                                </div>
                                <div>
                                  <Link href={item.href} className="font-bold text-slate-900">
                                    {item.name}
                                    <span className="absolute inset-0" />
                                  </Link>
                                  <p className="mt-1 text-slate-500">{item.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-slate-50 p-6 flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                                <DocumentTextIcon className="h-5 w-5 text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ready to optimize?</span>
                             </div>
                             <Link href="/resumes" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Explore Tool &rarr;</Link>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Transition>
                  </>
                )}
              </Popover>

              <a href="#how-it-works" className="text-[17px] font-medium text-slate-500 hover:text-slate-900 transition-colors">{t('landing.header.howItWorks')}</a>
              <a href="#pricing" className="text-[17px] font-medium text-slate-500 hover:text-slate-900 transition-colors">{t('landing.header.pricing')}</a>

              {/* Resources Dropdown */}
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <PopoverButton className={`group flex items-center space-x-1 outline-none text-[17px] font-medium transition-colors ${open ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}>
                      <span>{t('landing.header.resources.title')}</span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
                    </PopoverButton>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <PopoverPanel className="absolute left-1/2 z-10 mt-5 flex w-56 -translate-x-1/2 px-4">
                        <div className="w-56 overflow-hidden rounded-2xl bg-white p-2 text-sm shadow-2xl ring-1 ring-slate-900/5">
                          {resourceLinks.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center space-x-3 rounded-xl p-3 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <item.icon className="h-5 w-5 opacity-70" />
                              <span className="font-semibold">{item.name}</span>
                            </Link>
                          ))}
                        </div>
                      </PopoverPanel>
                    </Transition>
                  </>
                )}
              </Popover>

            </PopoverGroup>
          </div>

          {/* Action Section */}
          <div className="flex items-center">
            <LanguageSwitcher />
            {user ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all">
                   <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                      <UserIcon className="h-4 w-4" />
                   </div>
                   <span className="text-sm font-bold text-slate-700">{user.first_name}</span>
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-900/5 focus:outline-none">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          href="/dashboard"
                          className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${focus ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                        >
                          <BriefcaseIcon className="h-5 w-5 opacity-70" />
                          <span>Dashboard</span>
                        </Link>
                      )}
                    </MenuItem>
                    <div className="my-1 border-t border-slate-50"></div>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={handleLogout}
                          className={`flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${focus ? 'bg-rose-50 text-rose-700' : 'text-slate-600'}`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 opacity-70" />
                          <span>Sign out</span>
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            ) : (
              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  href="/login"
                  className="text-[17px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-7 py-3.5 rounded-2xl text-[16px] font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  Create free account
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden ml-4">
              <button
                type="button"
                className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="lg:hidden border-t border-slate-50 pb-8 pt-4 overflow-hidden"
            >
              <div className="space-y-1">
                <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</p>
                <MobileNavItem href="#features" text="Features" icon={SparklesIcon} />
                <MobileNavItem href="#how-it-works" text="How it works" icon={CpuChipIcon} />
                <MobileNavItem href="#pricing" text="Pricing" icon={DocumentTextIcon} />
                <MobileNavItem href="#roadmap" text="Roadmap" icon={MapIcon} />
                <MobileNavItem href="#faq" text="FAQ" icon={QuestionMarkCircleIcon} />
                {!user && (
                  <div className="mt-6 pt-6 px-4 border-t border-slate-50 space-y-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started Free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

function MobileNavItem({ href, text, icon: Icon }: { href: string, text: string, icon: any }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-4 px-4 py-4 text-lg font-bold text-slate-700 border-l-4 border-transparent hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
    >
      <Icon className="h-6 w-6 text-slate-400" />
      <span>{text}</span>
    </Link>
  )
}
