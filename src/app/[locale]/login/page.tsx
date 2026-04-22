import type { Metadata } from 'next'
import LoginClient from './LoginClient'
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.login' });

  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: true },
  };
}

export default function LoginPage() {
  return <LoginClient />
}
