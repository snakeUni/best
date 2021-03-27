import path from 'path'

export const CLIENT_PATH = path.join(__dirname, '../client')
export const NODE_PATH = path.join(__dirname, '../node')

export const DEFAULT_THEME =
  path.join(CLIENT_PATH, 'App.tsx') ||
  path.join(CLIENT_PATH, 'App.jsx') ||
  path.join(CLIENT_PATH, 'App.js')

// 虚拟的导入
export const VIRTUAL_THEME = '@!virtual-modules/theme'
export const VIRTUAL_DATA = '@!virtual-modules/data'
export const VIRTUAL_PAGES = '@!virtual-modules/pages'
