'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Mail, Lock, User, Loader2, Leaf } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signup(name, email, password)
      router.push('/predict')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
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
        <div className="text-center mb-8">
          <div className="icon-circle w-16 h-16 mx-auto mb-4">
            <Leaf className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-outfit font-bold text-emerald-50">Create Account</h1>
          <p className="text-emerald-200/50 mt-2">Join AgriVision to save your diagnoses</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
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
            <label className="text-sm font-medium text-emerald-200/70 mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nawazish Hassan"
                required
                id="signup-name"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

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
                id="signup-email"
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
                placeholder="Min 6 characters"
                required
                id="signup-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-emerald-200/70 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/50" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                id="signup-confirm"
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="signup-submit"
            className="w-full py-3.5 rounded-xl font-semibold text-lg glow-btn text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-emerald-200/50">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  )
}
