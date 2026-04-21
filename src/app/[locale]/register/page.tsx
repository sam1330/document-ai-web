import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import RegisterClient from './RegisterClient'

const BASE_URL = 'https://haku-ai.com';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'seo.register' })

  const canonicalUrl = `${BASE_URL}/${locale}/register`

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default function RegisterPage() {
  return <RegisterClient />
}
