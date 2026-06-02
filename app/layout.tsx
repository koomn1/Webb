import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
}

export const metadata: Metadata = {
  title: 'Youssef Badawi | Veterinary Medicine & AI Developer',
  description: 'Professional portfolio of Youssef Badawi - Veterinary specialist and AI/Full-stack developer. Showcasing expertise in both veterinary medicine and advanced software development.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  keywords: ['Veterinary Medicine', 'AI Developer', 'Full Stack', 'Software Development', 'Portfolio'],
  authors: [{ name: 'Youssef Badawi' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursiteurl.com',
    title: 'Youssef Badawi | Veterinary Medicine & AI Developer',
    description: 'Professional portfolio showcasing dual expertise in veterinary medicine and AI development',
    images: [
      {
        url: 'https://yoursiteurl.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Youssef Badawi Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youssef Badawi | Veterinary Medicine & AI Developer',
    description: 'Professional portfolio showcasing dual expertise in veterinary medicine and AI development',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
