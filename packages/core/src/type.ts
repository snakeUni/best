// 文档的配置项, 也可以使用 defineConfig 来支持 ts，通知也支持使用 yml 来配置

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

export interface UserConfig {
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
