'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, Menu, X, Globe, LogIn, LogOut, History, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user, isLoggedIn, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/predict', label: t.nav.detect },
    { href: '/chat', label: t.nav.chat },
    ...(isLoggedIn ? [{ href: '/history', label: 'History' }] : []),
    { href: '/team', label: t.nav.team },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 glass-navbar ${scrolled ? 'shadow-lg shadow-emerald-900/10' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group" id="nav-logo">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl text-emerald-100 group-hover:text-emerald-300 transition-colors">AgriVision</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                pathname === link.href ? 'text-emerald-300 nav-link-active' : 'text-emerald-100/60 hover:text-emerald-200 hover:bg-emerald-500/10'
              }`}>
                {link.label}
              </Link>
            ))}

            <div className="w-px h-6 bg-emerald-500/20 mx-2" />

            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card text-emerald-300/80 hover:text-emerald-200 transition-all text-sm">
              <Globe className="w-3.5 h-3.5" />
              <span className="font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            <div className="w-px h-6 bg-emerald-500/20 mx-1" />

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-emerald-200/70 text-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user?.name}</span>
                </div>
                <button onClick={logout} className="p-2 rounded-lg text-emerald-200/40 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg glow-btn text-white text-sm font-medium">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          <button className="md:hidden text-emerald-200/70 hover:text-emerald-200 p-2 rounded-lg hover:bg-emerald-500/10" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden border-t border-emerald-500/10">
              <div className="py-4 space-y-1">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className={`block py-2.5 px-4 rounded-lg font-medium text-sm ${
                    pathname === link.href ? 'text-emerald-300 bg-emerald-500/10' : 'text-emerald-100/60 hover:text-emerald-200 hover:bg-emerald-500/5'
                  }`} onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 px-4">
                  {isLoggedIn ? (
                    <button onClick={() => { logout(); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-red-400/70 hover:text-red-400 text-sm py-2">
                      <LogOut className="w-4 h-4" /> Logout ({user?.name})
                    </button>
                  ) : (
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-emerald-300 text-sm py-2">
                      <LogIn className="w-4 h-4" /> Login / Sign Up
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
