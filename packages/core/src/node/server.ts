import { createServer as createViteServer, ServerOptions } from 'vite'
import { resolveConfig } from './config'
import { createBestPlugin } from './plugin'

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {}
) {
  const config = await resolveConfig(root)
  return createViteServer({
    root,
    base: config.site.base,
    server: serverOptions,
    // use plugins
    plugins: createBestPlugin(root, config)
  })
}
