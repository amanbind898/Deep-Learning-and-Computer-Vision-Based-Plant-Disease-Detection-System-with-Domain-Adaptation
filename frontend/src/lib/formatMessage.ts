import DOMPurify from 'dompurify'

/**
 * Formats markdown-like text into sanitized HTML for chat messages.
 * Shared across ChatBot, ChatBotSidebar, and the Chat page.
 *
 * All output is sanitized with DOMPurify to prevent XSS attacks
 * before being rendered via dangerouslySetInnerHTML.
 */
export function formatMessage(text: string): string {
  const raw = text
    // Bold text with **
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-200">$1</strong>')
    // Numbered lists with bold
    .replace(
      /^(\d+)\.\s+<strong[^>]*>(.*?)<\/strong>/gm,
      '<div class="mt-3 mb-2"><strong class="font-bold text-emerald-200">$1. $2</strong></div>'
    )
    // Numbered lists without bold
    .replace(
      /^(\d+)\.\s+(.*?)$/gm,
      '<div class="mt-2"><span class="font-semibold text-emerald-300/80">$1.</span> $2</div>'
    )
    // Bullet points
    .replace(/^-\s+(.*?)$/gm, '<div class="ml-4 mt-1">• $1</div>')
    // Headings with ###
    .replace(
      /^###\s+(.*?)$/gm,
      '<h3 class="text-base font-bold text-emerald-200 mt-4 mb-2">$1</h3>'
    )
    // Line breaks
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')

  // Sanitize to prevent XSS — only allow safe tags and attributes
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ['strong', 'div', 'span', 'h3', 'br'],
    ALLOWED_ATTR: ['class'],
  })
}
