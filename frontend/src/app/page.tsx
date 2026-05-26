'use client'

import Link from 'next/link'
import { Leaf, Camera, MessageSquare, Globe, TrendingUp, Shield, Sparkles, ArrowRight, Cpu, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function Home() {
  const { t } = useLanguage()

  const features = [
    { icon: <Cpu className="w-6 h-6" />, title: t.home.features.aiDetection.title, description: t.home.features.aiDetection.desc },
    { icon: <BookOpen className="w-6 h-6" />, title: t.home.features.chatbot.title, description: t.home.features.chatbot.desc },
    { icon: <Globe className="w-6 h-6" />, title: t.home.features.multilingual.title, description: t.home.features.multilingual.desc },
    { icon: <TrendingUp className="w-6 h-6" />, title: t.home.features.treatment.title, description: t.home.features.treatment.desc },
    { icon: <Shield className="w-6 h-6" />, title: t.home.features.explainable.title, description: t.home.features.explainable.desc },
    { icon: <Leaf className="w-6 h-6" />, title: t.home.features.plants.title, description: t.home.features.plants.desc },
  ]

  const steps = [
    { step: '01', title: t.home.steps.upload.title, desc: t.home.steps.upload.desc, icon: <Camera className="w-6 h-6" /> },
    { step: '02', title: t.home.steps.analyze.title, desc: t.home.steps.analyze.desc, icon: <Cpu className="w-6 h-6" /> },
    { step: '03', title: t.home.steps.results.title, desc: t.home.steps.results.desc, icon: <TrendingUp className="w-6 h-6" /> },
  ]

  const stats = [
    { value: '96.1%', label: t.home.stats.accuracy },
    { value: '38', label: t.home.stats.diseases },
    { value: '14', label: t.home.stats.plants },
    { value: '70K+', label: t.home.stats.images },
  ]

  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative py-20 sm:py-28 md:py-36 px-4 overflow-hidden animated-bg">
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle bg-emerald-400/30"
            style={{
              width: `${4 + i * 3}px`,
              height: `${4 + i * 3}px`,
              left: `${10 + i * 15}%`,
              animationDuration: `${12 + i * 4}s`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-emerald-300/80 text-sm font-medium mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AgriNet Custom CNN — 98.75% Lab Accuracy
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-outfit font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-emerald-50">{t.home.title.split(' ').slice(0, 2).join(' ')} </span>
              <span className="gradient-text">{t.home.title.split(' ').slice(2).join(' ')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg sm:text-xl text-emerald-200/70 mb-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.home.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-base text-emerald-200/50 mb-10 max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t.home.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/predict"
                id="hero-cta-detect"
                className="group glow-btn text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                {t.home.startDetection}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/chat"
                id="hero-cta-chat"
                className="glass-card-hover px-8 py-4 rounded-xl font-semibold text-emerald-200 text-lg flex items-center justify-center gap-2 hover:text-emerald-100"
              >
                <MessageSquare className="w-5 h-5" />
                {t.home.liveDemo}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="relative py-8 border-y border-emerald-500/10">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="py-2"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold gradient-text stat-glow mb-1">
                  {stat.value}
                </div>
                <div className="text-emerald-200/50 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold text-emerald-50 mb-4">
              {t.home.powerfulFeatures}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass-card-hover p-7 group"
              >
                <div className="icon-circle w-12 h-12 mb-5 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-shadow duration-300">
                  <span className="text-emerald-400">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-outfit font-semibold text-emerald-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-emerald-200/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative border-t border-emerald-500/10">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold text-emerald-50 mb-4">
              {t.home.howItWorks}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-emerald-500/30 to-transparent" />
                )}

                {/* Step number circle */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center relative z-10"
                  whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
                >
                  <span className="text-emerald-400">{item.icon}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </motion.div>

                <h3 className="text-xl font-outfit font-semibold text-emerald-100 mb-2">{item.title}</h3>
                <p className="text-emerald-200/50 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative border-t border-emerald-500/10 animated-bg">
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="icon-circle w-16 h-16 mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold text-emerald-50 mb-6">
              {t.home.readyToProtect}
            </h2>
            <p className="text-emerald-200/50 text-lg mb-10 max-w-xl mx-auto">
              {t.home.description}
            </p>
            <Link
              href="/predict"
              id="cta-get-started"
              className="inline-flex items-center gap-3 glow-btn text-white px-10 py-5 rounded-xl font-bold text-xl"
            >
              {t.home.getStartedFree}
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
