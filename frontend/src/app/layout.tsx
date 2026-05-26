import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', weight: ['400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'AgriVision — AI Plant Disease Detection',
  description: 'AI-powered plant disease detection system using custom AgriNet CNN architecture with 96%+ accuracy across 38 disease classes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${outfit.variable}`}>
      <body className={`${inter.className} flex flex-col min-h-screen bg-dark-900 text-emerald-50`}>
        <AuthProvider>
          <LanguageProvider>
            <Navbar />
            <main className="flex-grow relative">{children}</main>
            <footer className="relative border-t border-emerald-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              <div className="container mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.07-1.38C14.54 18.36 13 15.37 13 12c0-3.37 1.54-6.36 4.07-8.62A9.93 9.93 0 0012 2z" />
                      </svg>
                    </div>
                    <span className="font-outfit font-bold text-lg text-emerald-100">AgriVision</span>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-200/60 text-sm">© 2025 AgriVision • B.Tech Major Project — IIIT Bhagalpur</p>
                    <p className="text-emerald-200/40 text-xs mt-1">Aman · Ankit · Sahil · Nawazish</p>
                  </div>
                  <div className="glass-card px-4 py-2">
                    <p className="text-emerald-300/70 text-xs font-medium tracking-wide">AgriNet CNN • FAISS RAG • FastAPI</p>
                  </div>
                </div>
              </div>
            </footer>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
