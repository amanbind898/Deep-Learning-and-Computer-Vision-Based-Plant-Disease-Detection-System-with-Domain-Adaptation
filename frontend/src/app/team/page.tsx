'use client'

import { Github, Linkedin, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TeamPage() {
  const { t } = useLanguage()

  const team = [
    {
      name: 'Aman Kumar Bind',
      roll: '2201086CS',
      role: 'ML Architect',
      gradient: 'from-emerald-500 to-teal-600',
      responsibilities: [
        'Custom CNN Architecture (AgriNet)',
        'Mixed-Domain Training Pipeline',
        'Model Optimization & Evaluation',
        'Training Documentation',
      ],
      github: 'https://github.com/amanbind898',
      linkedin: 'https://linkedin.com/in/amankumarbind',
      email: 'aman.2201086cs@iiitbh.ac.in',
    },
    {
      name: 'Ankit Kumar Patel',
      roll: '2201116CS',
      role: 'Backend Engineer',
      gradient: 'from-blue-500 to-cyan-600',
      responsibilities: [
        'FastAPI Server Architecture',
        'PostgreSQL Database Design',
        'JWT Authentication Flow',
        'API Endpoint Development',
      ],
      github: 'https://github.com/ankit',
      linkedin: 'https://linkedin.com/in/ankit',
      email: 'ankit.2201116cs@iiitbh.ac.in',
    },
    {
      name: 'Sahil Morwal',
      roll: '2201085CS',
      role: 'AI Integration Lead',
      gradient: 'from-purple-500 to-violet-600',
      responsibilities: [
        'LangChain RAG Pipeline',
        'FAISS Vector Database',
        'Groq LLM Integration',
        'Knowledge Base Ingestion',
      ],
      github: 'https://github.com/sahil',
      linkedin: 'https://linkedin.com/in/sahil',
      email: 'sahil.2201085cs@iiitbh.ac.in',
    },
    {
      name: 'Nawazish Hassan',
      roll: '2201031CS',
      role: 'Frontend & UI Architect',
      gradient: 'from-amber-500 to-orange-600',
      responsibilities: [
        'Next.js Frontend Architecture',
        'Glassmorphism UI/UX Design',
        'Frontend-Backend Integration',
        'Responsive Design & Animations',
      ],
      github: 'https://github.com/nawaz',
      linkedin: 'https://linkedin.com/in/nawaz',
      email: 'nawazish.2201031cs@iiitbh.ac.in',
    },
  ]

  const techStack = [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'FastAPI', category: 'Backend' },
    { name: 'PyTorch', category: 'ML' },
    { name: 'FAISS', category: 'Vector DB' },
    { name: 'LangChain', category: 'RAG' },
    { name: 'Groq', category: 'LLM' },
    { name: 'Tailwind CSS', category: 'Styling' },
    { name: 'Framer Motion', category: 'Animation' },
  ]

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 relative animated-bg">
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-bold text-emerald-50 mb-3">
            {t.team.title}
          </h1>
          <p className="text-emerald-200/50 text-lg">{t.team.subtitle}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mt-6" />
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-hover p-7 group"
            >
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className={`w-16 h-16 bg-gradient-to-br ${member.gradient} rounded-2xl flex items-center justify-center text-white text-2xl font-outfit font-bold flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  {member.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-outfit font-bold text-emerald-100 mb-0.5">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-sm font-medium bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </span>
                    <span className="text-emerald-200/30 text-xs">•</span>
                    <span className="text-emerald-200/40 text-xs font-mono">{member.roll}</span>
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-emerald-300/50 mb-2 uppercase tracking-wider">
                      {t.team.responsibilities}
                    </h4>
                    <ul className="space-y-1.5">
                      {member.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm text-emerald-200/50 flex items-start">
                          <span className="text-emerald-400/60 mr-2 mt-1 text-xs">▸</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex gap-2">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-emerald-200/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-emerald-200/40 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-lg glass-card flex items-center justify-center text-emerald-200/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl sm:text-3xl font-outfit font-bold text-emerald-100 mb-4">
            {t.team.about}
          </h2>
          <p className="text-emerald-200/50 text-sm leading-relaxed mb-6 max-w-3xl">
            {t.team.aboutDesc}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Tech Stack */}
            <div className="glass-card p-5">
              <h3 className="font-outfit font-semibold text-emerald-200 text-sm mb-3">{t.team.techStack}</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300/70 border border-emerald-500/15"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="glass-card p-5">
              <h3 className="font-outfit font-semibold text-emerald-200 text-sm mb-3">{t.team.duration}</h3>
              <p className="text-emerald-200/50 text-sm">
                B.Tech Major Project — IIIT Bhagalpur
              </p>
              <p className="text-emerald-200/40 text-xs mt-1">
                January 2025 – May 2025 (5th Semester)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
