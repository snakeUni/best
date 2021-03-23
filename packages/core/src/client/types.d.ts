declare module '@!virtual-modules/data' {
  import('../type')
  import { SiteData, ThemeConfig } from '../type'
  let data: SiteData<ThemeConfig>

  export default data
}
