// fork from https://github.com/vuejs/vitepress/blob/master/src/node/markdownToVue.ts

import fsExtra from 'fs-extra'
import path from 'path'
import matter from 'gray-matter'
import LRUCache from 'lru-cache'
import { createMdRender, MarkdownOptions } from './markdown'
import { deeplyParseHeader } from './utils/parseHeader'
import { slash } from './utils/slash'
import { PageData, HeadConfig } from '../type'

const debug = require('debug')('best:md')
const cache = new LRUCache<string, MarkdownCompileResult>({ max: 1024 })

interface MarkdownCompileResult {
  reactSrc: string
  pageData: PageData
}

export function createMdToReactRenderFn(
  root: string,
  options: MarkdownOptions = {},
  pages: string[]
) {
  const md = createMdRender(root, options)
  pages = pages.map(p => slash(p.replace(/\.md$/, '')))

  // src md 的内容, file 文件路径
  return (src: string, file: string): MarkdownCompileResult => {
    const relativePath = slash(path.relative(root, file))

    const cached = cache.get(src)
    if (cached) {
      debug(`[cache hit] ${relativePath}`)
      return cached
    }

    const start = Date.now()

    const { content, data: frontmatter } = matter(src)
    // 经过一系列插件处理返回新的内容
    let { html, data } = md.render(content)
    // avoid env variables being replaced by vite
    html = html
      .replace(/import\.meta/g, 'import.<wbr/>meta')
      .replace(/process\.env/g, 'process.<wbr/>env')
    const pageData: PageData = {
      title: inferTitle(frontmatter, content),
      description: inferDescription(frontmatter),
      frontmatter,
      headers: data.headers,
      relativePath,
      lastUpdated: Math.round(fsExtra.statSync(file).mtimeMs)
    }

    const reactSrc =
      genPageDataCode(data.hoistedTags || [], pageData).join('\n') +
      `\n<template><div>${html}</div></template>`

    debug(`[render] ${file} in ${Date.now() - start}ms`)

    const result = {
      reactSrc,
      pageData
    }
    cache.set(src, result)
    return result
  }
}

const inferTitle = (frontmatter: any, content: string) => {
  if (frontmatter.home) {
    return 'Home'
  }
  if (frontmatter.title) {
    return deeplyParseHeader(frontmatter.title)
  }
  const match = content.match(/^\s*#+\s+(.*)/m)
  if (match) {
    return deeplyParseHeader(match[1].trim())
  }
  return ''
}

const inferDescription = (frontmatter: Record<string, any>) => {
  const { description, head } = frontmatter

  if (description !== undefined) {
    return description
  }

  return (head && getHeadMetaContent(head, 'description')) || ''
}

const getHeadMetaContent = (head: HeadConfig[], name: string): string | undefined => {
  if (!head || !head.length) {
    return undefined
  }

  const meta = head.find(([tag, attrs = {}]) => {
    return tag === 'meta' && attrs.name === name && attrs.content
  })

  return meta && meta[1].content
}

const scriptRE = /<\/script>/
const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/
const defaultExportRE = /((?:^|\n|;)\s*)export(\s*)default/
const namedDefaultExportRE = /((?:^|\n|;)\s*)export(.+)as(\s*)default/

function genPageDataCode(tags: string[], data: PageData) {
  const code = `\nexport const __pageData = ${JSON.stringify(JSON.stringify(data))}`

  const existingScriptIndex = tags.findIndex(tag => {
    return scriptRE.test(tag) && !scriptSetupRE.test(tag)
  })

  if (existingScriptIndex > -1) {
    const tagSrc = tags[existingScriptIndex]
    // user has <script> tag inside markdown
    // if it doesn't have export default it will error out on build
    const hasDefaultExport = defaultExportRE.test(tagSrc) || namedDefaultExportRE.test(tagSrc)
    tags[existingScriptIndex] = tagSrc.replace(
      scriptRE,
      code + (hasDefaultExport ? `` : `\nexport default{}\n`) + `</script>`
    )
  } else {
    tags.unshift(`<script>${code}\nexport default {}</script>`)
  }

  return tags
}
