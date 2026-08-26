import type { MetadataRoute } from 'next'
import { KEYWORDS } from '@/lib/keywords'
import { CITIES } from '@/lib/cities'
import { BLOGS } from '@/lib/blogs'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://waki.in'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/guides/meta-business-verification`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/locations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/data-deletion`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const blogPages: MetadataRoute.Sitemap = BLOGS.map(b => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  const keywordHubPages: MetadataRoute.Sitemap = KEYWORDS.map(k => ({
    url: `${baseUrl}/${k.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  const cityHubPages: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${baseUrl}/location/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: c.tier === 'metro' ? 0.95 : c.tier === 'tier2' ? 0.85 : 0.75,
  }))

  const dynamicPages: MetadataRoute.Sitemap = []
  for (const keyword of KEYWORDS) {
    for (const city of CITIES) {
      dynamicPages.push({
        url: `${baseUrl}/${keyword.slug}/${city.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: city.tier === 'metro' ? 0.9 : city.tier === 'tier2' ? 0.8 : 0.7,
      })
    }
  }

  return [...staticPages, ...blogPages, ...keywordHubPages, ...cityHubPages, ...dynamicPages]
}
