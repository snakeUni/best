// 文档的配置项, 也可以使用 defineConfig 来支持 ts，通知也支持使用 yml 来配置
import MarkdownIt from 'markdown-it'
export interface Algolia {
  apiKey: string
  indexName: string
}

export interface Sidebar {
  /**
   * key 为路径
   * 'auto' 代表自动使用对应菜单下的 index.md
   */
  [key: string]: 'auto' | SidebarCustom[]
}

export interface MenuItem {
  /**
   * 菜单的文本
   */
  text: string
  /**
   * 菜单的链接
   */
  link: string
}

export interface SidebarCustom {
  text?: string
  children?: MenuItem[]
}

export interface NavWithChildren {
  text: string
  items?: MenuItem[]
}

export type MdPlugin =
  | MarkdownIt.PluginSimple
  | MarkdownIt.PluginWithOptions
  | MarkdownIt.PluginWithParams

// 配置可参考 https://vitepress.vuejs.org/config/basics.html
export interface UserConfig<ThemeConfig = any> {
  /**
   * 语言
   */
  lang?: string
  /**
   * base
   */
  base?: string
  /**
   * 文档搜索的配置项
   */
  algolia?: Algolia
  /**
   * 文档的标题
   */
  title?: string
  /**
   * 文档的描述，用于显示在标题下方
   */
  description?: string
  /**
   * 主题配置，也可以配置自己的 layout
   */
  themeConfig?: ThemeConfig
  /**
   * 自定义 md 插件
   */
  mdPlugins?: MdPlugin[]
}

/**
 * 站点 site 相关配置, 内部配置
 */
export interface SiteConfig<ThemeConfig = any> {
  root: string
  /**
   * config 路径，默认是项目根目录下的 .bestrc, best.config.js, best.config.ts
   */
  configPath: string
  /**
   * 默认使用 theme 包的主题
   */
  themeDir: string
  outDir: string
  site: SiteData<ThemeConfig>
  /**
   * 页面文件的路径
   */
  pages: string[]
}

export interface ThemeConfig {
  /**
   * 侧边栏菜单的配置
   * 'auto' 按照约定的文件结构
   */
  sidebar?: Sidebar | 'auto'
  /**
   * 头部导航栏
   */
  nav?: (MenuItem | NavWithChildren)[]
  /**
   * 如果是本地图片，那么默认读取 public 文件
   * 比如：/public/images/xxx.png，那么配置 /images/xx.png 引入即可
   */
  logo?: string
}

export interface SiteData<ThemeConfig = any> {
  lang: string
  base: string
  title: string
  description: string
  themeConfig: ThemeConfig
}

export interface Header {
  level: number
  title: string
  slug: string
}

// 页面数据，用 gray-matter 解析
export interface PageData {
  relativePath: string
  title: string
  description: string
  headers: Header[]
  frontmatter: Record<string, any>
  lastUpdated: number
}

export type HeadConfig = [string, Record<string, string>] | [string, Record<string, string>, string]
