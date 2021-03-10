import reactRefresh from '@vitejs/plugin-react-refresh'
import { SiteConfig } from '../type'

export const createBestPlugin = (root: string, { configPath, site }: SiteConfig) => {
  const reactRefreshPlugin = reactRefresh()

  // 处理 md

  return [reactRefreshPlugin]
}
