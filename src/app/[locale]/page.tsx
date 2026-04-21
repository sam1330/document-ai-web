import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import HomeClient from './HomeClient'

const BASE_URL = 'https://haku-ai.com'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'seo.home' })

  const canonicalUrl = `${BASE_URL}/${locale}`
  const alternateLocale = locale === 'en' ? 'es' : 'en'

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${BASE_URL}/en`,
        'es': `${BASE_URL}/es`,
        'x-default': `${BASE_URL}/en`,
      },
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: t('title'),
      description: t('description'),
      siteName: 'Haku',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: alternateLocale === 'es' ? 'es_ES' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default function Home() {
  return <HomeClient />
}
