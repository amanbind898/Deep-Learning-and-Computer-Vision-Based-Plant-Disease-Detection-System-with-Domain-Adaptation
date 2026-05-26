'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, Loader2, X, Sparkles } from 'lucide-react'
import { chatWithAI } from '@/lib/api'
import { formatMessage } from '@/lib/formatMessage'
import { useLanguage } from '@/contexts/LanguageContext'

interface ChatBotSidebarProps {
  plantName?: string
  diseaseName?: string
  onClose?: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBotSidebar({ plantName, diseaseName, onClose }: ChatBotSidebarProps) {
  const { language, t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    try {
      const response = await chatWithAI({ message: userMessage, plant_name: plantName, disease_name: diseaseName, language })
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: language === 'hi' ? 'क्षमा करें, एक त्रुटि हुई।' : 'Sorry, I encountered an error.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const quickQuestions = language === 'hi'
    ? ['इस बीमारी को कैसे रोकें?', 'सर्वोत्तम जैविक उपचार?', 'कवकनाशी कब लगाएं?']
    : ['How to prevent this disease?', 'Best organic treatment?', 'When to apply fungicide?']

  return (
    <div className="flex flex-col h-full w-96 bg-dark-900/95 backdrop-blur-xl border-l border-emerald-500/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-white" />
          <h3 className="font-outfit font-semibold text-white text-sm">{t.chat.title}</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Context */}
      {plantName && diseaseName && (
        <div className="px-4 py-3 border-b border-emerald-500/10 bg-emerald-500/5">
          <p className="text-xs text-emerald-200/50">
            <span className="font-semibold text-emerald-300/60">{t.chat.context}:</span> {plantName} — {diseaseName}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8 text-emerald-200/40">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-emerald-500/30" />
            <p className="text-sm mb-4">{t.chat.askAnything}</p>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-emerald-300/40">{t.chat.quickQuestions}</p>
              <div className="flex flex-col gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="px-3 py-2 text-xs text-left glass-card text-emerald-200/50 hover:text-emerald-200 hover:border-emerald-500/30 transition-all rounded-lg"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-xl p-3 text-sm ${
              message.role === 'user'
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-br-sm'
                : 'glass-card text-emerald-100/80 rounded-bl-sm'
            }`}>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="glass-card rounded-xl rounded-bl-sm p-3">
              <div className="flex items-center gap-1.5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-emerald-500/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t.chat.typeQuestion}
            className="flex-1 px-4 py-2.5 rounded-full glass-input text-sm"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="glow-btn text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
