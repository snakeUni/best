import path from 'path'
import chalk from 'chalk'
import fxExtra from 'fs-extra'
import globby from 'globby'
import { slash } from './utils/slash'
import { DEFAULT_THEME } from './constant'
import { UserConfig, SiteConfig } from '../type'

const debug = require('debug')('best:config')

export const configNames = ['.bestrc', 'best.config.ts', 'best.config.js']

const resolve = (root: string, file: string) => {
  return path.resolve(root, `.best`, file)
}

const resolveConfigPath = (root: string, file: string) => {
  return path.resolve(root, file)
}

const getResolveConfigPath = (root: string) => {
  const configPaths = configNames.map(name => resolveConfigPath(root, name))
  let existPath: string = ''
  for (let i = 0; i < configPaths.length; i++) {
    const currentConfigPath = configPaths[i]
    const hasUserConfig = fxExtra.pathExistsSync(currentConfigPath)

    if (hasUserConfig) {
      // always delete cache first
      delete require.cache[currentConfigPath]
      existPath = currentConfigPath
      break
    }
  }

  return existPath
}

export async function resolveUserConfig(root: string) {
  let existPath: string = getResolveConfigPath(root)
  const userConfig: UserConfig = existPath ? require(existPath) : {}

  if (existPath) {
    debug(`loaded config at ${chalk.yellow(existPath)}`)
  } else {
    debug(`no config file found`)
  }

  return userConfig
}

export async function resolveSiteData(root: string) {
  const userConfig: UserConfig = await resolveUserConfig(root)

  return {
    lang: userConfig.lang || 'en-US',
    title: userConfig.title || 'Best',
    description: userConfig.description || 'A Best Site',
    base: userConfig.base ? userConfig.base.replace(/([^/])$/, '$1/') : '/',
    themeConfig: userConfig.themeConfig || {}
  }
}

export async function resolveConfig(root: string = process.cwd()) {
  const siteData = await resolveSiteData(root)

  // resolve theme
  const userThemeDir = resolve(root, 'theme')
  const existUserThemeDir = fxExtra.pathExistsSync(userThemeDir)
  // 默认是从 client App 中寻找
  const themeDir = existUserThemeDir ? userThemeDir : DEFAULT_THEME

  const config: SiteConfig = {
    root,
    themeDir,
    site: siteData,
    configPath: getResolveConfigPath(root) || resolveConfigPath(root, 'best.config.js'),
    outDir: resolve(root, 'dist'),
    // 目前只针对 md 的文件，后续也允许其他文件
    pages: await globby(['**.md'], { cwd: root, ignore: ['node_modules'] })
  }

  return config
}

export async function resolveTheme(themePath: string) {
  if (await fxExtra.pathExists(themePath)) {
    return slash(themePath)
  }

  throw new Error("can't find theme: " + themePath)
}
