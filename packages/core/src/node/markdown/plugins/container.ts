// fork from https://github.com/vuejs/vitepress/blob/master/src/node/markdown/plugins/container.ts
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import Token from 'markdown-it/lib/token'

type ContainerArgs = [
  typeof container,
  string,
  {
    render(tokens: Token[], idx: number): string
  }
]

function createContainer(className: string, defaultTitle: string): ContainerArgs {
  return [
    container,
    className,
    {
      render(tokens, idx) {
        const token = tokens[idx]
        const info = token.info.trim().slice(className.length).trim()

        if (token.nesting === 1) {
          return `<div class="${className} custom-block"><p class="custom-block-title">${
            info || defaultTitle
          }</p>\n`
        } else {
          return `</div>\n`
        }
      }
    }
  ]
}

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer('tip', 'TIP'))
    .use(...createContainer('warning', 'WARNINNG'))
    .use(...createContainer('danger', 'WARNING'))
    .use(...createContainer('success', 'SUCCESS'))
}
