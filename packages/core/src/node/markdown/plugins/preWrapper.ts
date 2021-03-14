// fork from https://github.com/vuejs/vitepress/blob/master/src/node/markdown/plugins/preWrapper.ts

import MarkdownIt from 'markdown-it'

export const preWrapperPlugin = (md: MarkdownIt) => {
  const fence = md.renderer.rules.fence!

  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const rawCode = fence(...args)
    return `<div class="language-${token.info.trim()}">${rawCode}</div>`
  }
}
