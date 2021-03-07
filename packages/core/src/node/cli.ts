import minimist from 'minimist'
import chalk from 'chalk'
import { createServer } from 'vite'

const argv = minimist(process.argv.slice(2))

console.log(chalk.cyan(`best v${require('../package.json').version}`))
console.log(chalk.cyan(`vite v${require('vite/package.json').version}`))

const run = async () => {
  const command = argv._[0]

  // start command
  if (!command || command === 'dev') {
    return
  }

  // build command
  if (command === 'ssr') {
    return
  }

  if (command === 'ssg') {
    return
  }

  console.error(`invalid command.`)
}

run().catch(error => {
  console.log(chalk.red(error))
})
