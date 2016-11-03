#!/usr/bin/env node

/* globals process */

import path from 'path'
import chalk from 'chalk'
import yargs from 'yargs'

import syncGlob from '../index'

const argv = yargs.usage('sync-glob $0 <source> <target>')
  .boolean('delete')
  .alias('d', 'delete')
  .default('delete', true)
  .describe('delete', 'Delete extraneous files from target')
  .boolean('watch')
  .alias('w', 'watch')
  .default('watch', false)
  .describe('watch', 'Watch changes in source and keep target in sync')
  .number('depth')
  .alias('i', 'depth')
  .default('depth', Infinity)
  .describe('depth', 'Maximum depth if you have performance issues (not everywhere yet: only on existing mirrors and watch scenario)')
  .boolean('verbose')
  .alias('v', 'verbose')
  .default('verbose', false)
  .describe('verbose', 'Moar output')
  .version()
  .help('help')
  .argv
const _ = argv._
const length = _.length

if (length < 2) {
  console.error(chalk.bold.red(`Expects exactly two arguments, received ${length}`))
  process.exit(1)
}

const root = process.cwd()
const target = _.pop()
const source = _
const notifyPriority = {
  'error': 'high',
  'copy': 'normal',
  'remove': 'normal',
  'watch': 'normal',
  'max-depth': 'low',
  'no-delete': 'low',
}

syncGlob(source, target, {
  watch: argv.watch,
  delete: argv.delete,
  depth: argv.depth || Infinity,
}, (event, data) => {
  const priority = notifyPriority[event] || 'low'

  if (!argv.verbose && priority === 'low') {
    return
  }

  switch (event) {

    case 'error':
      console.error(chalk.bold.red(data.message || data))
      process.exit(data.code || 2)
      break

    case 'copy':
      console.log('%s %s to %s', chalk.bold('COPY'), chalk.yellow(path.relative(root, data[0])), chalk.yellow(path.relative(root, data[1])))
      break

    case 'remove':
      console.log('%s %s', chalk.bold('DELETE'), chalk.yellow(path.relative(root, data)))
      break

    case 'watch':
      console.log('%s %s', chalk.bold('WATCHING'), chalk.yellow(data))
      break

    case 'max-depth':
      console.log('%s: %s too deep', chalk.bold.dim('MAX-DEPTH'), chalk.yellow(path.relative(root, data)))
      break

    case 'no-delete':
      console.log('%s: %s extraneous but not deleted (use %s)', chalk.bold.dim('IGNORED'), chalk.yellow(path.relative(root, data)), chalk.blue('--delete'))
      break

    // Fallback: forgotten logs, displayed only in verbose mode
    default:
      if (argv.verbose) {
        console.log(event, data)
      }
  }
})
