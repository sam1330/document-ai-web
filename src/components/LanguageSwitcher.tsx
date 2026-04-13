'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  const switchLocale = (newLocale: string) => {
    // Replace the current locale in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Select language"
      >
        <GlobeAltIcon className="h-5 w-5 text-slate-600" />
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">
          {currentLocale?.flag} {currentLocale?.name}
        </span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50"
        >
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => switchLocale(loc.code)}
              className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center space-x-3 ${
                locale === loc.code ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700'
              }`}
            >
              <span className="text-lg">{loc.flag}</span>
              <span className="text-sm font-medium">{loc.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
