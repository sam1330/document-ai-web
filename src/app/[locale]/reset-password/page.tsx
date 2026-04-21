import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import ResetPasswordClient from './ResetPasswordClient'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'seo.resetPassword' })

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: true },
  }
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
