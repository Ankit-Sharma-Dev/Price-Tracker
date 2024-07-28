import Navbar from '@/components/Navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'

// Define font configurations
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'], 
  variable: '--font-space-grotesk'
});

// Metadata for SEO
export const metadata: Metadata = {
  title: 'PriceTracker',
  description: 'Track product prices effortlessly and save money on your online shopping.',
  icons: {
    icon: '/favicon.ico', // Add favicon if necessary
  },
};

// Root layout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <main className="max-w-10xl mx-auto px-4">
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  )
}

