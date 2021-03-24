export const inBrowser = typeof window !== 'undefined'

export function pathToFile(path: string): string {
  let pagePath = path.replace(/\.html$/, '')
  if (pagePath.endsWith('/')) {
    pagePath += 'index'
  }

  if ((import.meta as any).env.DEV) {
    pagePath += `.md?t=${Date.now()}`
  } else {
    const base = (import.meta as any).env.BASE_URL
    pagePath = pagePath.slice(base.length).replace(/\//g, '_') + '.md'
    const pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()]
    pagePath = `${base}assets/${pagePath}.${pageHash}.js`
  }

  return pagePath
}
