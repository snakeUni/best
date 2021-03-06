import minimist from 'minimist'
import chalk from 'chalk'
import { execSync } from 'child_process'

const argv = minimist(process.argv.slice(2))

console.log(chalk.cyan(`best v${require('../package.json').version}`))
console.log(chalk.cyan(`vite v${require('vite/package.json').version}`))

const exec = (command: string) => {
  execSync(command)
}

const run = async () => {
  const command = argv._[0]

  if (command === 'server') {
    exec('vite server')
    return
  }

  if (command === 'ssr') {
  }

  if (command === 'ssg') {
  }
}

run().catch(error => {
  console.log(chalk.red(error))
})
