declare module '@!virtual-modules/data' {
  import('../type')
  import { SiteData, ThemeConfig } from '../type'
  let data: SiteData<ThemeConfig>

  export default data
}

declare module '@!virtual-modules/theme' {
  const App: React.FC

  export default App
}

declare module '@!virtual-modules/pages' {
  const pages: string[]
  export default pages
}

declare const __VP_HASH_MAP__: Record<string, string>
