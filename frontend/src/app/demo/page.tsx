'use client'

import { useState, useRef } from 'react'
import { Camera, X, Loader2, Info } from 'lucide-react'
import PredictionCard from '@/components/PredictionCard'
import { predictDisease } from '@/lib/api'
import type { PredictionResult } from '@/types'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DemoPage() {
  const { language } = useLanguage()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setError(null)
    } catch {
      setError('Failed to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(async (blob) => {
      if (!blob) return
      setLoading(true)
      setError(null)
      try {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
        const result = await predictDisease(file)
        setPrediction(result)
        stopCamera()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Prediction failed')
      } finally {
        setLoading(false)
      }
    }, 'image/jpeg')
  }

  const reset = () => {
    setPrediction(null)
    setError(null)
    startCamera()
  }

  const tips = language === 'hi'
    ? ['अच्छी रोशनी सुनिश्चित करें', 'एक पत्ती पर ध्यान केंद्रित करें', 'कैमरा स्थिर रखें', 'छाया और प्रतिबिंब से बचें']
    : ['Ensure good lighting conditions', 'Focus on a single leaf with clear symptoms', 'Hold the camera steady and close', 'Avoid shadows and reflections']

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 relative animated-bg">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-emerald-50 mb-3">
            {language === 'hi' ? 'लाइव कैमरा पहचान' : 'Live Camera Detection'}
          </h1>
          <p className="text-emerald-200/50 text-base">
            {language === 'hi' ? 'रीयल-टाइम में पौधों की बीमारियों का पता लगाएं' : 'Detect plant diseases in real-time using your camera'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-lg font-outfit font-semibold text-emerald-100 mb-4">
              {language === 'hi' ? 'कैमरा' : 'Camera'}
            </h2>

            {!stream && !prediction && (
              <div className="text-center py-14">
                <div className="icon-circle w-16 h-16 mx-auto mb-4">
                  <Camera className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-emerald-200/50 mb-6">
                  {language === 'hi' ? 'कैमरा शुरू करें' : 'Start your camera to capture plant images'}
                </p>
                <button onClick={startCamera} id="demo-start-camera" className="glow-btn text-white px-6 py-3 rounded-xl font-semibold">
                  {language === 'hi' ? 'कैमरा शुरू करें' : 'Start Camera'}
                </button>
              </div>
            )}

            {stream && (
              <div className="space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 bg-dark-800">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
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
                  id="demo-capture"
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    loading ? 'bg-emerald-500/20 text-emerald-300/50 cursor-not-allowed' : 'glow-btn text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === 'hi' ? 'विश्लेषण...' : 'Analyzing...'}
                    </span>
                  ) : (language === 'hi' ? 'कैप्चर और विश्लेषण' : 'Capture & Analyze')}
                </button>
              </div>
            )}

            {prediction && (
              <div className="text-center py-10">
                <p className="text-emerald-200/50 mb-4">
                  {language === 'hi' ? 'छवि सफलतापूर्वक विश्लेषित!' : 'Image captured and analyzed!'}
                </p>
                <button onClick={reset} className="glow-btn text-white px-6 py-3 rounded-xl font-semibold">
                  {language === 'hi' ? 'दूसरा कैप्चर करें' : 'Capture Another'}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {prediction ? (
              <PredictionCard prediction={prediction} />
            ) : (
              <div className="glass-card p-10 text-center">
                <div className="icon-circle w-16 h-16 mx-auto mb-4">
                  <Camera className="w-7 h-7 text-emerald-400/50" />
                </div>
                <p className="text-emerald-200/40">
                  {language === 'hi' ? 'परिणाम देखने के लिए छवि कैप्चर करें' : 'Capture an image to see prediction results'}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-outfit font-semibold text-emerald-100">
              {language === 'hi' ? 'सर्वोत्तम परिणामों के लिए सुझाव' : 'Tips for Best Results'}
            </h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-200/50">
                <span className="text-emerald-400/60 mt-0.5">▸</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
