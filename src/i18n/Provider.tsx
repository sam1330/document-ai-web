"use client";

import { NextIntlClientProvider } from 'next-intl';
import { useParams } from 'next/navigation';

export default function LocaleLayout({
  children,
  messages,
  locale
}: {
  children: React.ReactNode;
  messages: Record<string, any>;
  locale?: string;
}) {

  return (
    <NextIntlClientProvider locale={locale || 'en'} messages={messages} timeZone='America/Caracas'>
      {children}
    </NextIntlClientProvider>
  );
}
