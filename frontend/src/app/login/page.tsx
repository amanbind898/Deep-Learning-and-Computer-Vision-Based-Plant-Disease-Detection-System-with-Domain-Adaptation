'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogIn, Mail, Lock, Loader2, Leaf } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.push('/predict')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 animated-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="icon-circle w-16 h-16 mx-auto mb-4">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-emerald-50">Welcome Back</h1>
          <p className="text-emerald-200/50 mt-2">Sign in to your AgriVision account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="text-sm font-medium text-emerald-200/70 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                id="login-email"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-emerald-200/70 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                id="login-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="login-submit"
            className="w-full py-3.5 rounded-xl font-semibold text-lg glow-btn text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-emerald-200/50">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
