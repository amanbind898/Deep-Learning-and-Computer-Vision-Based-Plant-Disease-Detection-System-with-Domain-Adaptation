'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  History, Trash2, TrendingUp, Leaf, AlertCircle, CheckCircle, Loader2,
  BarChart3, X, Shield, FlaskConical, ChevronRight, Calendar, Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface PredictionRecord {
  id: string
  plantName: string
  diseaseName: string
  confidence: number
  isHealthy: boolean
  topPredictions: Array<{ plant_name: string; disease_name: string; confidence: number }>
  recommendations: {
    status: string
    message: string
    fungicides?: string[]
    precautions?: string[]
    organic_options?: string[]
    preventive_measures?: string[]
    note?: string
  }
  createdAt: string
}

interface Stats {
  totalPredictions: number
  healthyCount: number
  diseasedCount: number
  averageConfidence: number
  mostCommonDisease: string | null
}

export default function HistoryPage() {
  const router = useRouter()
  const { user, token, isLoggedIn, loading: authLoading } = useAuth()
  const [predictions, setPredictions] = useState<PredictionRecord[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<PredictionRecord | null>(null)

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.push('/login')
  }, [authLoading, isLoggedIn, router])

  useEffect(() => {
    if (token) { fetchHistory(); fetchStats() }
  }, [token])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setPredictions(data.predictions)
      }
    } catch {} finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/history/stats', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setStats(await res.json())
    } catch {}
  }

  const deletePrediction = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    try {
      await fetch(`/api/history/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      setPredictions((prev) => prev.filter((p) => p.id !== id))
      if (selectedReport?.id === id) setSelectedReport(null)
      fetchStats()
    } catch {}
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  if (authLoading || (!isLoggedIn && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 animated-bg">
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-emerald-50 mb-2">Diagnosis History</h1>
          <p className="text-emerald-200/50">Welcome, {user?.name}. Click on any diagnosis to view the full report.</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && stats.totalPredictions > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Scans', value: stats.totalPredictions, icon: <BarChart3 className="w-5 h-5" />, color: 'text-emerald-400' },
              { label: 'Healthy', value: stats.healthyCount, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
              { label: 'Diseased', value: stats.diseasedCount, icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-400' },
              { label: 'Avg Confidence', value: `${stats.averageConfidence}%`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-teal-400' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
                <div className="text-2xl font-outfit font-bold gradient-text">{stat.value}</div>
                <div className="text-emerald-200/40 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Predictions List */}
        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" /></div>
        ) : predictions.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <div className="icon-circle w-16 h-16 mx-auto mb-4">
              <History className="w-7 h-7 text-emerald-400/50" />
            </div>
            <h3 className="text-xl font-outfit font-semibold text-emerald-100 mb-2">No diagnoses yet</h3>
            <p className="text-emerald-200/40 mb-6">Upload your first plant image to start tracking</p>
            <Link href="/predict" className="glow-btn text-white px-6 py-3 rounded-xl font-semibold inline-block">
              Start Detection
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {predictions.map((pred, i) => (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedReport(pred)}
                  className="glass-card-hover p-5 flex items-center gap-4 cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    pred.isHealthy ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-red-500/15 border border-red-500/30'
                  }`}>
                    {pred.isHealthy
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : <AlertCircle className="w-5 h-5 text-red-400" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-outfit font-semibold text-emerald-100 text-sm truncate">{pred.plantName}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        pred.isHealthy ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {pred.isHealthy ? 'Healthy' : pred.diseaseName}
                      </span>
                    </div>
                    <p className="text-emerald-200/40 text-xs">
                      {formatDate(pred.createdAt)} · {formatTime(pred.createdAt)}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold gradient-text">{pred.confidence.toFixed(1)}%</span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-emerald-200/20 group-hover:text-emerald-400 transition-colors flex-shrink-0" />

                  <button
                    onClick={(e) => deletePrediction(pred.id, e)}
                    className="text-emerald-200/20 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 flex-shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ───── Full Report Modal ───── */}
      <AnimatePresence>
        {selectedReport && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-900/80 backdrop-blur-md z-40"
              onClick={() => setSelectedReport(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-4 sm:inset-x-auto sm:inset-y-8 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 overflow-y-auto rounded-2xl glass-card border border-emerald-500/20"
            >
              {/* Report Header */}
              <div className={`sticky top-0 z-10 p-6 pb-4 border-b backdrop-blur-xl ${
                selectedReport.isHealthy ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
              }`} style={{ backgroundColor: selectedReport.isHealthy ? 'rgba(6,13,9,0.95)' : 'rgba(13,6,6,0.95)' }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      selectedReport.isHealthy
                        ? 'bg-emerald-500/15 border-2 border-emerald-500/30'
                        : 'bg-red-500/15 border-2 border-red-500/30'
                    }`}>
                      {selectedReport.isHealthy
                        ? <CheckCircle className="w-7 h-7 text-emerald-400" />
                        : <AlertCircle className="w-7 h-7 text-red-400" />
                      }
                    </div>
                    <div>
                      <h2 className="text-xl font-outfit font-bold text-emerald-50">Diagnosis Report</h2>
                      <div className="flex items-center gap-3 mt-1 text-xs text-emerald-200/40">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(selectedReport.createdAt)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatTime(selectedReport.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedReport(null)} className="p-2 rounded-lg text-emerald-200/40 hover:text-emerald-200 hover:bg-emerald-500/10 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Diagnosis Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-xs text-emerald-200/40 mb-1 uppercase tracking-wider">Plant</p>
                    <p className="text-lg font-outfit font-semibold text-emerald-100">{selectedReport.plantName}</p>
                  </div>
                  <div className="glass-card p-4">
                    <p className="text-xs text-emerald-200/40 mb-1 uppercase tracking-wider">
                      {selectedReport.isHealthy ? 'Status' : 'Disease'}
                    </p>
                    <p className={`text-lg font-outfit font-semibold ${selectedReport.isHealthy ? 'text-emerald-300' : 'text-red-300'}`}>
                      {selectedReport.isHealthy ? '✓ Healthy' : selectedReport.diseaseName}
                    </p>
                  </div>
                </div>

                {/* Confidence */}
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-emerald-200/40 uppercase tracking-wider">Confidence Score</p>
                    <span className="text-2xl font-outfit font-bold gradient-text">{selectedReport.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-emerald-500/10 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(selectedReport.confidence, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    />
                  </div>
                </div>

                {/* Top Predictions */}
                {selectedReport.topPredictions && selectedReport.topPredictions.length > 0 && (
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-outfit font-semibold text-emerald-100 uppercase tracking-wider">Top 5 Predictions</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedReport.topPredictions.map((pred, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-emerald-200/60 truncate mr-2">
                              {idx + 1}. {pred.plant_name} — {pred.disease_name}
                            </span>
                            <span className="text-emerald-300/80 font-semibold flex-shrink-0">{pred.confidence.toFixed(2)}%</span>
                          </div>
                          <div className="w-full bg-emerald-500/10 rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(pred.confidence, 100)}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.1 }}
                              className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500/60 to-teal-400/60"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {selectedReport.recommendations && (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-outfit font-semibold text-emerald-100 uppercase tracking-wider mb-4">
                      {selectedReport.isHealthy ? '🌿 Preventive Care' : '💊 Treatment Plan'}
                    </h3>

                    {selectedReport.recommendations.message && (
                      <p className={`text-sm font-medium mb-4 px-3 py-2 rounded-lg ${
                        selectedReport.isHealthy ? 'text-emerald-400/80 bg-emerald-500/10' : 'text-red-400/80 bg-red-500/10'
                      }`}>
                        {selectedReport.recommendations.message}
                      </p>
                    )}

                    {/* Preventive Measures (Healthy) */}
                    {selectedReport.recommendations.preventive_measures && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-emerald-300/60 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-3 h-3" /> Preventive Measures
                        </h4>
                        <ul className="space-y-2">
                          {selectedReport.recommendations.preventive_measures.map((m, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-200/60">
                              <Shield className="w-3.5 h-3.5 text-emerald-400/50 mt-0.5 flex-shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fungicides (Diseased) */}
                    {selectedReport.recommendations.fungicides && selectedReport.recommendations.fungicides.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-emerald-300/60 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                          <FlaskConical className="w-3 h-3" /> Recommended Fungicides
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.recommendations.fungicides.map((f, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300/80 font-medium">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Precautions */}
                    {selectedReport.recommendations.precautions && selectedReport.recommendations.precautions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-emerald-300/60 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-3 h-3" /> Precautions
                        </h4>
                        <ul className="space-y-2">
                          {selectedReport.recommendations.precautions.map((p, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-200/60">
                              <span className="text-amber-400 mt-0.5">▸</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Organic Options */}
                    {selectedReport.recommendations.organic_options && selectedReport.recommendations.organic_options.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-emerald-300/60 mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
                          <Leaf className="w-3 h-3" /> Organic Options
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.recommendations.organic_options.map((o, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-lg text-xs bg-teal-500/10 border border-teal-500/20 text-teal-300/80 font-medium">
                              {o}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Note */}
                    {selectedReport.recommendations.note && (
                      <p className="text-xs text-emerald-200/30 italic pt-3 border-t border-emerald-500/10">
                        ⓘ {selectedReport.recommendations.note}
                      </p>
                    )}
                  </div>
                )}

                {/* Report ID */}
                <p className="text-center text-emerald-200/20 text-[10px] tracking-widest uppercase">
                  Report ID: {selectedReport.id}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
