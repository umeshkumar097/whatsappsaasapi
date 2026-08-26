import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOGS, getBlogsByCategory, BlogPost } from '@/lib/blogs'
import { ArrowRight, Clock, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'WhatsApp Marketing Blog — Tips, Guides & Strategies | Waki',
  description: 'Expert WhatsApp marketing guides, tips, and strategies for Indian businesses. 100+ articles on bulk messaging, chatbots, automation, and city-specific guides.',
  alternates: { canonical: 'https://waki.in/blog' },
}

export default function BlogListingPage() {
  const featuredBlogs = BLOGS.slice(0, 4);
  const cityGuides = getBlogsByCategory('city-guide');
  const featureGuides = getBlogsByCategory('feature-guide');
  const industryGuides = getBlogsByCategory('industry-guide');
  const strategyTips = getBlogsByCategory('strategy');

  const categories = [
    { id: 'city-guides', name: 'City Guides', blogs: cityGuides },
    { id: 'feature-guides', name: 'Feature Guides', blogs: featureGuides },
    { id: 'industry-guides', name: 'Industry Guides', blogs: industryGuides },
    { id: 'strategy', name: 'Strategy & Tips', blogs: strategyTips },
  ];

  const BlogCard = ({ blog }: { blog: BlogPost }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="h-44 w-full relative overflow-hidden">
        <img
          src={`https://picsum.photos/seed/${blog.slug}/800/400`}
          alt={blog.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 opacity-50" style={{ background: blog.coverColor }} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <Tag size={12} />
            {blog.category}
          </span>
          <span className="flex items-center text-gray-500 text-xs gap-1">
            <Clock size={12} />
            {blog.readingTime}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/blog/${blog.slug}`} className="hover:text-green-600 transition-colors">
            {blog.title}
          </Link>
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {blog.excerpt.substring(0, 100)}...
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-xs text-gray-400">
            {new Date(blog.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <Link 
            href={`/blog/${blog.slug}`}
            className="text-green-600 font-medium text-sm flex items-center gap-1 hover:text-green-700 transition-colors"
          >
            Read More <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section */}
          <div className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              WhatsApp Marketing <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              100+ Expert Guides for Indian Businesses to scale customer engagement.
            </p>
            
            {/* Category Filter Anchors */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.map(cat => (
                <a 
                  key={cat.id} 
                  href={`#${cat.id}`}
                  className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-green-500 hover:text-green-600 transition-all shadow-sm"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>

          {/* Featured Blogs */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Featured Reads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredBlogs.map(blog => (
                <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group relative rounded-2xl overflow-hidden shadow-lg h-80 flex flex-col justify-end">
                  <img
                    src={`https://picsum.photos/seed/${blog.slug}/800/500`}
                    alt={blog.title}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  <div className="absolute inset-0 z-0 opacity-60" style={{ background: blog.coverColor }} />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10" />
                  <div className="relative z-20 p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full">
                        {blog.category}
                      </span>
                      <span className="text-white/80 text-sm flex items-center gap-1">
                        <Clock size={14} /> {blog.readingTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:underline">{blog.title}</h3>
                    <p className="text-white/80 line-clamp-2">{blog.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Categories Sections */}
          {categories.map(cat => cat.blogs.length > 0 && (
            <section key={cat.id} id={cat.id} className="mb-16 pt-8">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900">{cat.name}</h2>
                <span className="text-gray-500 text-sm font-medium">{cat.blogs.length} Articles</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.blogs.map(blog => (
                  <BlogCard key={blog.slug} blog={blog} />
                ))}
              </div>
            </section>
          ))}

        </div>
      </main>

      {/* Internal Links / Sitemap snippet for SEO */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            Looking for something specific? View our <Link href="/sitemap.xml" className="text-green-600 hover:underline">Sitemap</Link> or check out our <Link href="/locations" className="text-green-600 hover:underline">Locations Directory</Link>.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
