import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOGS, getBlogBySlug, getRelatedBlogs } from '@/lib/blogs'
import { getBlogArticleContent } from '@/lib/blogContent'
import { KEYWORDS, getKeywordBySlug } from '@/lib/keywords'
import { CITIES, getCityBySlug } from '@/lib/cities'
import { Clock, Tag, ArrowRight, Share2, BookOpen, CheckCircle, Calendar, User } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOGS.map(blog => ({ slug: blog.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) return { title: 'Not Found' }
  
  return {
    title: blog.metaTitle,
    description: blog.metaDescription,
    keywords: blog.tags,
    alternates: { canonical: `https://waki.in/blog/${slug}` },
    openGraph: {
      title: blog.metaTitle,
      description: blog.metaDescription,
      url: `https://waki.in/blog/${slug}`,
      type: 'article',
      publishedTime: blog.publishDate,
      tags: blog.tags,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)
  if (!blog) notFound()

  const content = getBlogArticleContent(blog)
  const relatedBlogs = getRelatedBlogs(blog.slug, 3)

  const city = blog.relatedCity ? getCityBySlug(blog.relatedCity) : null
  const keyword = blog.relatedKeyword ? getKeywordBySlug(blog.relatedKeyword) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.metaDescription,
    image: `https://waki.in/images/og-blog.jpg`, // placeholder
    datePublished: blog.publishDate,
    author: {
      '@type': 'Organization',
      name: 'Waki Editorial Team',
      url: 'https://waki.in'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Waki',
      logo: {
        '@type': 'ImageObject',
        url: 'https://waki.in/logo.png'
      }
    }
  }

  const breadcrumbsLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://waki.in' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://waki.in/blog' },
      { '@type': 'ListItem', position: 3, name: blog.title, item: `https://waki.in/blog/${blog.slug}` }
    ]
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }} />
      
      <Header />

      {/* Cover Section */}
      <section 
        className="pt-32 pb-20 relative overflow-hidden"
      >
        <img
          src={`https://picsum.photos/seed/${blog.slug}/1200/600`}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 opacity-70" style={{ background: blog.coverColor }} />
        <div className="absolute inset-0 bg-black/30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-center text-sm font-medium text-white/80 mb-6 space-x-2">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white">{blog.category}</span>
          </nav>
          
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase tracking-wider mb-6">
            <Tag size={14} /> {blog.category}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 text-sm font-medium">
            <div className="flex items-center gap-2">
              <User size={16} /> Waki Editorial Team
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} /> {new Date(blog.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> {blog.readingTime} read
            </div>
          </div>
        </div>
      </section>

      {/* Article Layout */}
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar - Sticky */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-32 space-y-8">
              {/* Table of Contents */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-green-600" /> Contents
                </h4>
                <ul className="space-y-3 text-sm">
                  {content.tableOfContents.map((heading, idx) => (
                    <li key={idx}>
                      <a 
                        href={`#section-${idx}`} 
                        className="text-gray-600 hover:text-green-600 leading-snug block transition-colors"
                      >
                        {heading}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#faqs" className="text-gray-600 hover:text-green-600 leading-snug block transition-colors">FAQs</a>
                  </li>
                </ul>
              </div>

              {/* Share & CTA */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-center">Share Guide</h4>
                <div className="flex justify-center gap-4 mb-6">
                  <a href={`https://api.whatsapp.com/send?text=Check out this guide: https://waki.in/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors" title="Share on WhatsApp">
                    <Share2 size={20} />
                  </a>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 text-center">
                  <h5 className="font-bold text-green-900 mb-2">Ready to grow?</h5>
                  <p className="text-xs text-green-700 mb-4">Start your WhatsApp marketing journey with Waki today.</p>
                  <a href="https://app.waki.in/signup" className="block w-full py-2 bg-green-600 text-white rounded font-medium text-sm hover:bg-green-700 transition-colors">
                    Try Waki Free
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:w-3/4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 lg:p-12">
            
            <div className="prose prose-lg prose-green max-w-none">
              <p className="text-xl leading-relaxed text-gray-700 mb-8 font-medium">
                {content.introduction}
              </p>

              {/* Key Takeaways */}
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg my-10">
                <h3 className="text-xl font-bold text-green-900 mt-0 mb-4">Key Takeaways</h3>
                <ul className="space-y-3 m-0 list-none pl-0">
                  {content.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-800">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body Sections */}
              {content.sections.map((section, idx) => (
                <section key={idx} id={`section-${idx}`} className="mb-12 scroll-mt-32">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                    {section.heading}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {section.content}
                  </p>
                  {section.subsections?.map((sub, subIdx) => (
                    <div key={subIdx} className="mb-6 ml-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{sub.heading}</h3>
                      <p className="text-gray-700">{sub.content}</p>
                    </div>
                  ))}
                </section>
              ))}

              <hr className="my-12 border-gray-200" />

              {/* FAQs */}
              <section id="faqs" className="mb-12 scroll-mt-32">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {content.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{faq.q}</h4>
                      <p className="text-gray-700 m-0">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Conclusion */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                <p className="text-gray-700 leading-relaxed font-medium bg-gray-50 p-6 rounded-lg italic">
                  {content.conclusion}
                </p>
              </section>
            </div>

            {/* Bottom CTA Banner */}
            <div className="mt-12 bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-center sm:text-left sm:flex items-center justify-between shadow-lg text-white">
              <div className="mb-6 sm:mb-0 sm:mr-6">
                <h3 className="text-2xl font-bold mb-2">Ready to transform your communication?</h3>
                <p className="text-green-100">Join thousands of Indian businesses growing with Waki's WhatsApp marketing platform.</p>
              </div>
              <a href="https://app.waki.in/signup" className="inline-block bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-md whitespace-nowrap">
                Start Free Trial <ArrowRight className="inline ml-2" size={20} />
              </a>
            </div>

            {/* Tags & Internal Links */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm font-bold text-gray-900 mr-2 py-1">Tags:</span>
                {blog.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                <span className="text-gray-500">Explore more:</span>
                {city && <Link href={`/location/${city.slug}`} className="text-green-600 hover:underline">{city.name} Guide</Link>}
                {keyword && <Link href={`/${keyword.slug}`} className="text-green-600 hover:underline">{keyword.displayName} Services</Link>}
                {city && keyword && <Link href={`/${keyword.slug}/${city.slug}`} className="text-green-600 hover:underline">{keyword.displayName} in {city.name}</Link>}
                <Link href="/services" className="text-green-600 hover:underline">All Services</Link>
                <Link href="/locations" className="text-green-600 hover:underline">All Locations</Link>
              </div>
            </div>

          </article>
        </div>
      </main>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="bg-white py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Keep Reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map(related => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:border-green-300 transition-colors h-full flex flex-col">
                    <div className="h-40 w-full relative overflow-hidden">
                      <img
                        src={`https://picsum.photos/seed/${related.slug}/600/300`}
                        alt={related.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 opacity-40" style={{ background: related.coverColor }} />
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <span className="text-xs font-bold text-green-600 uppercase mb-2">{related.category}</span>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">{related.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mt-auto">{related.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
