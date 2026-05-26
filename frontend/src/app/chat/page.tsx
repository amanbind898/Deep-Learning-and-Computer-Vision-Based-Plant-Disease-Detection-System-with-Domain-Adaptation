'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Leaf, CheckCircle, Sparkles, Bot } from 'lucide-react'
import { chatWithAI } from '@/lib/api'
import { formatMessage } from '@/lib/formatMessage'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { language, t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Only scroll within the messages container, not the whole page
  useEffect(() => {
    if (messages.length === 0) return
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, loading])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)
    try {
      const response = await chatWithAI({ message: userMessage, language })
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: language === 'hi' ? 'क्षमा करें, एक त्रुटि हुई।' : 'Sorry, I encountered an error. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const quickQuestions = language === 'hi'
    ? ['टमाटर की बीमारियों के बारे में बताएं', 'जैविक कीटनाशक कैसे बनाएं?', 'फसल चक्र क्या है?', 'मिट्टी की उर्वरता कैसे बढ़ाएं?']
    : ['Tell me about tomato diseases', 'How to make organic pesticides?', 'What is crop rotation?', 'How to improve soil fertility?']

  return (
    /* Full-height flex container: navbar is above, this fills the rest */
    <div className="flex flex-col animated-bg" style={{ height: 'calc(100vh - 73px)' }}>

      {/* Scrollable messages area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 pt-6 pb-4">

          {/* Welcome Screen */}
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-12 sm:py-20"
              >
                <div className="text-center mb-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                    <Bot className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-emerald-50 mb-3">
                    {t.chat.chatPage.title}
                  </h1>
                  <p className="text-emerald-200/50 max-w-md mx-auto">
                    {t.chat.chatPage.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-10">
                  {[
                    { icon: <Sparkles className="w-4 h-4" />, label: language === 'hi' ? 'AI संचालित' : 'AI Powered' },
                    { icon: <Leaf className="w-4 h-4" />, label: language === 'hi' ? 'कृषि विशेषज्ञ' : 'Agri Expert' },
                    { icon: <CheckCircle className="w-4 h-4" />, label: language === 'hi' ? 'हिंदी/English' : 'Bilingual' },
                  ].map((f, i) => (
                    <div key={i} className="glass-card px-3 py-3 flex flex-col items-center gap-1.5 text-center">
                      <span className="text-emerald-400">{f.icon}</span>
                      <span className="text-emerald-200/60 text-xs">{f.label}</span>
                    </div>
                  ))}
                </div>

                <div className="max-w-lg mx-auto">
                  <p className="text-xs font-semibold text-emerald-300/50 mb-3 uppercase tracking-wider text-center">
                    {t.chat.quickQuestions}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(q)}
                        id={`quick-q-${i}`}
                        className="px-4 py-3 text-sm text-left rounded-xl glass-card-hover text-emerald-200/60 hover:text-emerald-200 transition-all"
                      >
                        <span className="text-emerald-400 mr-2">→</span>{q}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-5 py-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-br-sm shadow-lg shadow-emerald-500/10'
                        : 'glass-card text-emerald-100/90 rounded-bl-sm'
                    }`}
                  >
                    <div
                      className="text-sm leading-relaxed break-words"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold">
                      U
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="glass-card rounded-2xl rounded-bl-sm px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Bar — part of flex layout, always at bottom */}
      <div className="flex-shrink-0 border-t border-emerald-500/10" style={{ backgroundColor: 'rgba(6,13,9,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto max-w-3xl px-4 py-3">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.chat.typeQuestion}
              id="chat-input"
              className="flex-1 px-5 py-3.5 rounded-2xl glass-input text-sm"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              id="chat-send"
              className="glow-btn text-white w-12 h-12 rounded-2xl flex items-center justify-center disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-[10px] text-emerald-200/20 mt-1.5 text-center">
            Powered by Groq • Llama 3.1 • {language === 'hi' ? 'हिंदी में भी पूछ सकते हैं' : 'Ask in Hindi or English'}
          </p>
        </div>
      </div>
    </div>
  )
}
