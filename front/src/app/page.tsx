import Link from 'next/link'
import { Metadata } from 'next'
import RecentPosts from '@/components/post/RecentPosts'

export const metadata: Metadata = {
  title: 'Home | My Blog',
  description: 'Welcome to my blog. Explore the latest posts and stay updated.',
}

export default function Home() {
  return (
    <div className="min-h-screen text-text-primary">
      <main className="container mx-auto px-4 py-16 mb-8">
        <h1 className="text-5xl font-bold mb-8 text-center text-text-primary">
          Welcome to My Blog
        </h1>
        <p className="text-xl mb-12 text-center text-text-secondary">
          Explore our latest posts and stay updated with the newest trends.
        </p>

        <div className="flex justify-center space-x-4 m-5">
          <Link
            href="/posts"
            className="bg-accent-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            View Posts
          </Link>
          <Link
            href="/about"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            About Us
          </Link>
        </div>

        <RecentPosts />
      </main>
    </div>
  )
}
