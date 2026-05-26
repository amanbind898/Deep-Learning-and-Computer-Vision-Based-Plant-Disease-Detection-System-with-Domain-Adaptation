'use client'

import { AlertCircle, CheckCircle, TrendingUp, Shield, Leaf, FlaskConical } from 'lucide-react'
import type { PredictionResult } from '@/types'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface PredictionCardProps {
  prediction: PredictionResult
}

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const { t } = useLanguage()
  const { plant_name, disease_name, confidence, is_healthy, top_5_predictions, recommendations } = prediction

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Main Result */}
      <div
        className={`glass-card p-6 relative overflow-hidden ${
          is_healthy
            ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10'
            : 'border-red-500/30 shadow-lg shadow-red-500/10'
        }`}
        style={{
          borderColor: is_healthy ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)',
        }}
      >
        {/* Status glow */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
            is_healthy ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}
        />

        <div className="flex items-start gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            is_healthy
              ? 'bg-emerald-500/15 border border-emerald-500/30'
              : 'bg-red-500/15 border border-red-500/30'
          }`}>
            {is_healthy ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-outfit font-bold mb-2 ${is_healthy ? 'text-emerald-300' : 'text-red-300'}`}>
              {is_healthy ? t.predict.result.healthy : t.predict.result.diseased}
            </h3>
            <div className="space-y-1.5">
              <p className="text-sm text-emerald-100/80">
                <span className="text-emerald-200/50">{t.predict.result.plant}:</span>{' '}
                <span className="font-semibold">{plant_name}</span>
              </p>
              <p className="text-sm text-emerald-100/80">
                <span className="text-emerald-200/50">{is_healthy ? t.predict.result.status : t.predict.result.disease}:</span>{' '}
                <span className="font-semibold">{disease_name}</span>
              </p>
              <p className="text-sm text-emerald-100/80">
                <span className="text-emerald-200/50">{t.predict.result.confidence}:</span>{' '}
                <span className="font-bold gradient-text">{confidence.toFixed(2)}%</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Predictions */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-outfit font-semibold text-emerald-100">{t.predict.result.top5}</h3>
        </div>
        <div className="space-y-3">
          {top_5_predictions.map((pred, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-200/60 truncate mr-2">
                  {pred.plant_name} — {pred.disease_name}
                </span>
                <span className="text-emerald-300/80 font-semibold flex-shrink-0">{pred.confidence.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-emerald-500/10 rounded-full h-1.5">
                <div
                  className="confidence-bar"
                  style={{ width: `${Math.min(pred.confidence, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations && (
        <div className="glass-card p-6">
          <h3 className="text-base font-outfit font-semibold text-emerald-100 mb-4">
            {is_healthy ? t.predict.result.preventive : t.predict.result.recommendations}
          </h3>

          {is_healthy ? (
            <div className="space-y-2">
              <p className="text-emerald-400/80 text-sm font-medium mb-3">{recommendations.message}</p>
              <ul className="space-y-2">
                {recommendations.preventive_measures?.map((measure: string, index: number) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-emerald-200/60">
                    <Shield className="w-3.5 h-3.5 text-emerald-400/60 mt-0.5 flex-shrink-0" />
                    {measure}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-400/80 text-sm font-medium">{recommendations.message}</p>

              {recommendations.fungicides && recommendations.fungicides.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-300/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3 h-3" />
                    {t.predict.result.fungicides}
                  </h4>
                  <ul className="space-y-1.5">
                    {recommendations.fungicides.map((f: string, i: number) => (
                      <li key={i} className="text-sm text-emerald-200/50 ml-1">▸ {f}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendations.precautions && recommendations.precautions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-300/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    {t.predict.result.precautions}
                  </h4>
                  <ul className="space-y-1.5">
                    {recommendations.precautions.map((p: string, i: number) => (
                      <li key={i} className="text-sm text-emerald-200/50 ml-1">▸ {p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendations.organic_options && recommendations.organic_options.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-emerald-300/60 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-3 h-3" />
                    {t.predict.result.organic}
                  </h4>
                  <ul className="space-y-1.5">
                    {recommendations.organic_options.map((o: string, i: number) => (
                      <li key={i} className="text-sm text-emerald-200/50 ml-1">▸ {o}</li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendations.note && (
                <p className="text-xs text-emerald-200/30 italic mt-3 pt-3 border-t border-emerald-500/10">
                  ⓘ {recommendations.note}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
