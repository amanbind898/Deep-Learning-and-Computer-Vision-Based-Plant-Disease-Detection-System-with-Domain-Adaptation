'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Camera, X, Loader2, MessageSquare, ChevronRight, LogIn } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import PredictionCard from '@/components/PredictionCard'
import ChatBotSidebar from '@/components/ChatBotSidebar'
import { predictDisease } from '@/lib/api'
import type { PredictionResult } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function PredictPage() {
  const { t } = useLanguage()
  const { token, isLoggedIn } = useAuth()
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload')
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.muted = true
      videoRef.current.play().catch(err => console.error('Play error:', err))
    }
  }, [stream])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
      setActiveTab('upload')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
    disabled: loading,
  })

  const startCamera = async () => {
    try {
      setError(null)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera not supported in this browser.')
        return
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      setStream(mediaStream)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.muted = true
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(err => setError('Failed to start video.'))
          }
        }
      }, 100)
    } catch (err: any) {
      let msg = 'Failed to access camera. '
      if (err.name === 'NotAllowedError') msg += 'Please allow camera access.'
      else if (err.name === 'NotFoundError') msg += 'No camera found.'
      else if (err.name === 'NotReadableError') msg += 'Camera in use by another app.'
      else msg += 'Check permissions and try again.'
      setError(msg)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) { setError('Camera not ready.'); return }
    const video = videoRef.current
    const canvas = canvasRef.current
    if (video.readyState !== video.HAVE_ENOUGH_DATA) { setError('Video not ready.'); return }
    const context = canvas.getContext('2d')
    if (!context) return
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(async (blob) => {
      if (!blob) return
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      setSelectedFile(file)
      setPreview(canvas.toDataURL())
      stopCamera()
      await handleAnalyze(file)
    }, 'image/jpeg', 0.95)
  }

  const handleAnalyze = async (file?: File) => {
    const f = file || selectedFile
    if (!f) return
    setLoading(true)
    setError(null)
    setPrediction(null)
    try {
      const result = await predictDisease(f)
      setPrediction(result)
      setChatOpen(true)
      setSaved(false)
      // Auto-save to history if logged in
      if (token) {
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              plantName: result.plant_name,
              diseaseName: result.disease_name,
              confidence: result.confidence,
              isHealthy: result.is_healthy,
              topPredictions: result.top_5_predictions,
              recommendations: result.recommendations,
            }),
          })
          setSaved(true)
        } catch {}
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setSelectedFile(null)
    setPrediction(null)
    setError(null)
    stopCamera()
  }

  return (
    <div className="min-h-screen py-6 sm:py-10 px-4 relative animated-bg">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold text-emerald-50 mb-3">
            {t.predict.title}
          </h1>
          <p className="text-emerald-200/50 text-base sm:text-lg">
            {t.predict.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Upload/Camera */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <button
                onClick={() => { setActiveTab('upload'); stopCamera() }}
                id="tab-upload"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'upload'
                    ? 'bg-emerald-500/15 text-emerald-300 shadow-sm'
                    : 'text-emerald-200/50 hover:text-emerald-200'
                }`}
              >
                <Upload className="w-4 h-4" />
                {t.predict.uploadTab}
              </button>
              <button
                onClick={() => { setActiveTab('camera'); handleClear() }}
                id="tab-camera"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === 'camera'
                    ? 'bg-emerald-500/15 text-emerald-300 shadow-sm'
                    : 'text-emerald-200/50 hover:text-emerald-200'
                }`}
              >
                <Camera className="w-4 h-4" />
                {t.predict.cameraTab}
              </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <>
                {!preview ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-10 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? 'border-emerald-400 bg-emerald-500/10 pulse-ring'
                        : 'border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input {...getInputProps()} />
                    <div className="icon-circle w-16 h-16 mx-auto mb-4">
                      <Upload className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="text-emerald-200/70 text-base mb-2">{t.predict.dragDrop}</p>
                    <p className="text-emerald-200/40 text-sm">{t.predict.supports}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden border border-emerald-500/20">
                      <img src={preview} alt="Preview" className="w-full h-auto max-h-80 object-contain bg-dark-800" />
                      {!loading && (
                        <button
                          onClick={handleClear}
                          className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleAnalyze()}
                      disabled={loading}
                      id="btn-analyze"
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        loading
                          ? 'bg-emerald-500/20 text-emerald-300/50 cursor-not-allowed'
                          : 'glow-btn text-white'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t.predict.analyzing}
                        </span>
                      ) : t.predict.analyze}
                    </button>
                    {!loading && (
                      <button
                        onClick={handleClear}
                        className="w-full py-3 rounded-xl font-medium text-emerald-200/60 border border-emerald-500/15 hover:bg-emerald-500/5 transition-all"
                      >
                        {t.predict.uploadAnother}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Camera Tab */}
            {activeTab === 'camera' && (
              <>
                {!stream && !preview ? (
                  <div className="text-center py-14">
                    <div className="icon-circle w-16 h-16 mx-auto mb-4">
                      <Camera className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="text-emerald-200/50 mb-6">{t.predict.startCamera}</p>
                    <button onClick={startCamera} className="glow-btn text-white px-6 py-3 rounded-xl font-semibold">
                      {t.predict.startCamera}
                    </button>
                  </div>
                ) : stream ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 bg-dark-800">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto min-h-[300px]" />
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent animate-scan-line" />
                      </div>
                      <button
                        onClick={stopCamera}
                        className="absolute top-3 right-3 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={captureImage}
                      disabled={loading}
                      id="btn-capture"
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                        loading ? 'bg-emerald-500/20 text-emerald-300/50 cursor-not-allowed' : 'glow-btn text-white'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />{t.predict.analyzing}
                        </span>
                      ) : t.predict.capture}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden border border-emerald-500/20">
                      <img src={preview || ''} alt="Captured" className="w-full h-auto max-h-80 object-contain bg-dark-800" />
                    </div>
                    <button onClick={handleClear} className="w-full py-3 rounded-xl font-medium text-emerald-200/60 border border-emerald-500/15 hover:bg-emerald-500/5 transition-all">
                      {t.predict.startCamera}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>

          {/* Right — Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {prediction ? (
              <div>
                <PredictionCard prediction={prediction} />

                {/* Saved indicator */}
                {saved && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-emerald-400/60 text-xs mt-3"
                  >
                    ✓ Saved to your history
                  </motion.p>
                )}
                {!isLoggedIn && prediction && (
                  <p className="text-center text-emerald-200/30 text-xs mt-3">
                    <Link href="/login" className="text-emerald-400 hover:underline">Login</Link> to save this to your history
                  </p>
                )}

                {/* Chat toggle button */}
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className="w-full mt-4 py-3 rounded-xl font-medium text-emerald-200/70 border border-emerald-500/15 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {chatOpen ? 'Close Chat' : 'Ask AI about this disease'}
                </button>
              </div>
            ) : (
              <div className="glass-card p-10 text-center">
                <div className="icon-circle w-16 h-16 mx-auto mb-4">
                  <Upload className="w-7 h-7 text-emerald-400/50" />
                </div>
                <p className="text-emerald-200/40">{t.predict.uploadToSee}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Chatbot Sidebar — Fixed overlay, doesn't affect page layout */}
      <AnimatePresence>
        {chatOpen && prediction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm z-40"
              onClick={() => setChatOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-96 z-50 shadow-2xl"
            >
              <ChatBotSidebar
                plantName={prediction.plant_name}
                diseaseName={prediction.disease_name}
                onClose={() => setChatOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

