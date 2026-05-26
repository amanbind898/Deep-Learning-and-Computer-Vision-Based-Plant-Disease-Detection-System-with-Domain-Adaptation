'use client'

import { useState } from 'react'
import { MessageSquare, Send, Loader2, Globe, Sparkles } from 'lucide-react'
import { chatWithAI } from '@/lib/api'
import { formatMessage } from '@/lib/formatMessage'

interface ChatBotProps {
  plantName?: string
  diseaseName?: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot({ plantName, diseaseName }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [isOpen, setIsOpen] = useState(false)

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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 backdrop-blur-sm p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-white" />
          <h3 className="font-outfit font-semibold text-white text-sm">AI Agricultural Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setLanguage(language === 'en' ? 'hi' : 'en') }}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20 transition-colors text-white"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'EN' : 'हि'}</span>
          </button>
          <span className="text-lg text-white/80">{isOpen ? '−' : '+'}</span>
        </div>
      </div>

      {/* Chat Area */}
      {isOpen && (
        <div className="p-4">
          {messages.length === 0 && (
            <div className="text-center py-8 text-emerald-200/40">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 text-emerald-500/30" />
              <p className="text-sm mb-2">
                {language === 'en' ? 'Ask me about plant diseases and treatments!' : 'पौधों की बीमारियों के बारे में पूछें!'}
              </p>
              {plantName && diseaseName && (
                <p className="text-xs text-emerald-200/30">
                  {language === 'en' ? `Context: ${plantName} - ${diseaseName}` : `संदर्भ: ${plantName} - ${diseaseName}`}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${
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
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'en' ? 'Type your question...' : 'अपना सवाल लिखें...'}
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

          {messages.length === 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-emerald-200/40 font-medium">
                {language === 'en' ? 'Quick questions:' : 'त्वरित प्रश्न:'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(language === 'en'
                  ? ['How to prevent this disease?', 'Best organic treatment?', 'When to apply fungicide?']
                  : ['इस बीमारी को कैसे रोकें?', 'सर्वोत्तम जैविक उपचार?', 'कवकनाशी कब लगाएं?']
                ).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 text-xs glass-card text-emerald-200/50 hover:text-emerald-200 hover:border-emerald-500/30 transition-all rounded-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
