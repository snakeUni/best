import chalk from 'chalk'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import anchor from 'markdown-it-anchor'
// custom plugin
import { slugify } from './plugins/slugify'

const debug = require('debug')('best:md')
const toc = require('markdown-it-table-of-contents')

export interface MarkdownOptions extends MarkdownIt.Options {
  /**
   * 是否显示行号
   */
  lineNumbers?: boolean
  // https://github.com/valeriangalliat/markdown-it-anchor
  anchor?: anchor.AnchorOptions
}

export function createMdRender(root: string, options: MarkdownOptions = {}) {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    // TODO 自定义高亮规则
    highlight: () => {
      return ''
    },
    ...options
  })

  md.use(emoji)
    .use(anchor, {
      slugify,
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#',
      permalinkAttrs: () => ({ 'aria-hidden': true }),
      ...options.anchor
    })
    .use(toc, {
      slugify,
      includeLevel: [2, 3]
      // TODO
    })
}
