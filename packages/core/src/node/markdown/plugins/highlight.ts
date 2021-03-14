import hljs from 'highlight.js'
import escapeHtml from 'escape-html'

export const highlight = (str: string, lang: string) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + '</code></pre>'
    } catch (__) {}
  }

  return '<pre class="hljs"><code>' + escapeHtml(str) + '</code></pre>'
}
