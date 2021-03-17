import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import anchor from 'markdown-it-anchor'
// custom plugin
import { slugify } from './plugins/slugify'
import { lineNumberPlugin } from './plugins/lineNumbers'
import { preWrapperPlugin } from './plugins/preWrapper'
import { highlight } from './plugins/highlight'
import { containerPlugin } from './plugins/container'
import { extractHeaderPlugin } from './plugins/header'
import { Header } from '../../type'

const toc = require('markdown-it-table-of-contents')

export interface MarkdownOptions extends MarkdownIt.Options {
  /**
   * 是否显示行号
   */
  lineNumbers?: boolean
  // https://github.com/valeriangalliat/markdown-it-anchor
  anchor?: anchor.AnchorOptions
  // toc
  toc?: any
  config?: (md: MarkdownIt) => void
}

export interface MarkdownParsedData {
  hoistedTags?: string[]
  links?: string[]
  headers?: Header[]
}

export interface MarkdownRenderer {
  __data: MarkdownParsedData
  render: (src: string, env?: any) => { html: string; data: any }
}

export function createMdRender(root: string, options: MarkdownOptions = {}): MarkdownRenderer {
  const md = MarkdownIt({
    html: true,
    linkify: true,
    // TODO 自定义高亮规则
    highlight,
    ...options
  })

  // custom plugins
  md.use(preWrapperPlugin).use(containerPlugin).use(extractHeaderPlugin)

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
      includeLevel: [2, 3],
      ...options.toc
    })

  if (options.config) {
    options.config(md)
  }

  if (options.lineNumbers) {
    md.use(lineNumberPlugin)
  }

  const render = md.render
  const wrappedRender: MarkdownRenderer['render'] = src => {
    ;(md as any).__data = {}
    const html = render.call(md, src)
    return {
      html,
      data: (md as any).__data
    }
  }

  ;(md as any).render = wrappedRender
  return md as any
}
