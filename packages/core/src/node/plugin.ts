import reactRefresh from '@vitejs/plugin-react-refresh'
import { Plugin } from 'vite'
import { resolveTheme } from './config'
import { VIRTUAL_THEME, VIRTUAL_DATA, VIRTUAL_PAGES } from './constant'
import { createMdToReactRenderFn } from './mdToReact'
import { SiteConfig } from '../type'

export const createBestPlugin = (
  root: string,
  { site, pages, markdown, themeDir }: SiteConfig,
  ssr = false
) => {
  const reactRefreshPlugin = reactRefresh()
  const mdToReact = createMdToReactRenderFn(root, markdown, pages)

  // 处理 md
  const bestPlugin: Plugin = {
    name: 'best',
    config: () => ({
      resolve: {},
      // 定义一些全局的变量
      define: {
        __SSR__: ssr
      }
    }),
    resolveId(id) {
      // 处理在 client 里导入此模板
      if (id === VIRTUAL_THEME) {
        return id
      }
      if (id === VIRTUAL_DATA) {
        return id
      }

      if (id === VIRTUAL_PAGES) {
        return id
      }
    },
    async load(id) {
      // 如果有自定义的主题则直接从文件中导出，否则使用默认主题
      if (id === VIRTUAL_THEME) {
        return `export { default } from "${await resolveTheme(themeDir)}"`
      }

      if (id === VIRTUAL_DATA) {
        return `export default ${JSON.stringify(JSON.stringify(site))}`
      }

      if (id === VIRTUAL_PAGES) {
        return `export default ${JSON.stringify(JSON.stringify(pages))}`
      }
    },
    transform(code, id) {
      if (id.endsWith('.md')) {
        // transform md to react src
        const { reactSrc } = mdToReact(code, id)
        return reactSrc
      }
    }
  }
  return [reactRefreshPlugin, bestPlugin]
}
