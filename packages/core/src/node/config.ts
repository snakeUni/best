import path from 'path'
import chalk from 'chalk'
import fxExtra from 'fs-extra'
import { UserConfig } from '../type'

const debug = require('debug')('best:config')

export const configNames = ['.bestrc', 'best.config.ts', 'best.config.js']

const resolve = (root: string, file: string) => {
  return path.resolve(root, file)
}

export async function resolveUserConfig(root: string) {
  const configPaths = configNames.map(name => resolve(root, name))
  let existPath: string = ''
  for (let i = 0; i < configPaths.length; i++) {
    const currentConfigPath = configPaths[i]
    const hasUserConfig = fxExtra.pathExistsSync(currentConfigPath)

    if (hasUserConfig) {
      existPath = currentConfigPath
      break
    }
  }

  const userConfig: UserConfig = existPath ? require(existPath) : {}

  if (existPath) {
    debug(`loaded config at ${chalk.yellow(existPath)}`)
  } else {
    debug(`no config file found`)
  }

  return userConfig
}
