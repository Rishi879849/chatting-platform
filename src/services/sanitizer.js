import DOMPurify from 'dompurify';

/**
 * Encodes special HTML characters into safe HTML entities to prevent Reflected & Stored XSS.
 */
export function escapeHTML(str = '') {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Uses DOMPurify to strip malicious tags (script, iframe, onerror, javascript:)
 * while preserving safe academic formatting and layout tags.
 */
export function sanitizeHTML(dirtyContent = '') {
  if (!dirtyContent || typeof dirtyContent !== 'string') return '';

  return DOMPurify.sanitize(dirtyContent, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'code', 'pre', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'id'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'svg'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Sanitizes markdown text by ensuring code blocks and math formulas cannot inject raw HTML.
 */
export function sanitizeMarkdown(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return '';
  const escaped = escapeHTML(rawText);
  return sanitizeHTML(escaped);
}
