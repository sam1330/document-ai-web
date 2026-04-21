import { MetadataRoute } from 'next'

const BASE_URL = 'https://haku-ai.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all public pages
        userAgent: '*',
        allow: [
          '/',
          '/en/',
          '/es/',
          '/en/register',
          '/es/register',
          '/en/login',
          '/es/login',
          '/en/terms',
          '/es/terms',
          '/en/privacy',
          '/es/privacy',
        ],
        // Block all authenticated/private app routes
        disallow: [
          '/en/dashboard',
          '/es/dashboard',
          '/en/resumes',
          '/es/resumes',
          '/en/applications',
          '/es/applications',
          '/en/profile',
          '/es/profile',
          '/en/print/',
          '/es/print/',
          '/en/email-verification',
          '/es/email-verification',
          '/en/email-verified',
          '/es/email-verified',
          '/en/forgot-password',
          '/es/forgot-password',
          '/en/reset-password',
          '/es/reset-password',
          '/api/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
