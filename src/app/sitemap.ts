import { MetadataRoute } from 'next'

const BASE_URL = 'https://haku-ai.com'
const locales = ['en', 'es'] as const

// Public routes to include in the sitemap
const publicRoutes = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
  { path: '/register', priority: 0.9, changeFrequency: 'monthly' as const },
  { path: '/login', priority: 0.5, changeFrequency: 'monthly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        // Add hreflang alternates for each entry
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${route.path}`])
          ),
        },
      })
    }
  }

  return entries
}
