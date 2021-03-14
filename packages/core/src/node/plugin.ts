import reactRefresh from '@vitejs/plugin-react-refresh'
import { SiteConfig } from '../type'

export const createBestPlugin = (
  root: string,
  { configPath, site, pages }: SiteConfig,
  ssr = false
) => {
  const reactRefreshPlugin = reactRefresh()

  // 处理 md

  return [reactRefreshPlugin]
}
