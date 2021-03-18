import reactRefresh from '@vitejs/plugin-react-refresh'
import { Plugin } from 'vite'
import { createMdToReactRenderFn } from './mdToReact'
import { SiteConfig } from '../type'

export const createBestPlugin = (
  root: string,
  { configPath, site, pages, markdown }: SiteConfig,
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
      if (id === '@!virtual-modules/theme') {
        return id
      }
    },
    async load(id) {
      if (id === '@!virtual-modules/theme') {
      }
    }
  }

  return [reactRefreshPlugin, bestPlugin]
}
