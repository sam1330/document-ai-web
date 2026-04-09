'use client'

import { useState, Fragment, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import CreditsService from '@/services/credits'
import { useCredits } from '@/contexts/CreditContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
  { name: 'Resumes', href: '/resumes', icon: DocumentTextIcon },
  { name: 'Applications', href: '/applications', icon: BriefcaseIcon },
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { balance } = useCredits();

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="group flex items-center space-x-2">
                <div className="p-1.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                  Haku
                </span>
              </Link>
            </div>
            <div className="hidden sm:flex sm:items-center sm:space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <item.icon className={`mr-2 h-4 w-4 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {/* Notification Bell */}
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative group">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform"></span>
            </button>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center p-1 cursor-pointer rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md text-white font-bold text-xs">
                  {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                </div>
                <div className="ml-3 text-left hidden lg:block mr-2">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tight">
                    <span className='font-bold text-slate-900'>{balance}</span> Credits Available
                  </p>
                </div>
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95 -translate-y-2"
                enterTo="transform opacity-100 scale-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100 translate-y-0"
                leaveTo="transform opacity-0 scale-95 -translate-y-2"
              >
                <MenuItems className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-slate-200 focus:outline-none backdrop-blur-xl">
                  <div className="px-3 py-2 mb-2 border-b border-slate-50">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
                  </div>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                          } flex items-center px-3 py-2 text-sm font-semibold rounded-xl transition-colors`}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 opacity-70" />
                        Settings
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-rose-50 text-rose-700' : 'text-slate-600'
                          } flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm font-semibold rounded-xl transition-colors mt-1`}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 opacity-70" />
                        Sign out
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Transition>
            </Menu>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Transition
        show={mobileMenuOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 -translate-y-4"
        enterTo="transform opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 translate-y-0"
        leaveTo="transform opacity-0 -translate-y-4"
      >
        <div className="sm:hidden bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-xl overflow-hidden">
          <div className="space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-base font-bold rounded-2xl transition-all ${isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center px-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md text-white font-bold">
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </div>
              <div className="ml-3">
                <div className="text-sm font-bold text-slate-900 leading-none">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-tight">
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 px-2">
              <Link
                href="/profile"
                className="flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-2 text-sm font-bold text-rose-700 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </nav>
  )
}
