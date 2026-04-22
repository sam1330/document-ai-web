import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";

const BASE_URL = 'https://haku-ai.com';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'seo.terms' });

  const canonicalUrl = `${BASE_URL}/${locale}/terms`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${BASE_URL}/en/terms`,
        'es': `${BASE_URL}/es/terms`,
        'x-default': `${BASE_URL}/en/terms`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default function Terms() {
  const t = useTranslations("legal.terms");
  const lastUpdated = new Date("2026-04-9");

  type Section = {
    title: string;
    content: string | string[];
    subContent?: string[];
  };

  const sections = t.raw("sections") as Section[];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />

      <div className="max-w-7xl mx-auto pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        <div className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl font-bold text-zinc-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-zinc-500">
            {t("lastUpdated")}: {lastUpdated.toDateString()}
          </p>
        </div>

        {/* Content Section using Tailwind Prose */}
        <article className="prose prose-zinc max-w-none">
          <p>{t("intro")}</p>

          {sections.map((section, index) => (
            <div key={index}>
              <h2>{section.title}</h2>
              {Array.isArray(section.content) ? (
                <ul>
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
              {section.subContent && (
                <ul>
                  {section.subContent.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>
      </div>
      <Footer />
    </div>
  );
}
