#!/usr/bin/env node

/* globals process */

import path from 'path'
import chalk from 'chalk'
import yargs from 'yargs'

import syncGlob from '../index'

const argv = yargs.usage('Usage: $0 <sources> <target>')
  .boolean('delete')
  .alias('d', 'delete')
  .default('delete', true)
  .describe('delete', 'Delete extraneous files from target')
  .boolean('watch')
  .alias('w', 'watch')
  .default('watch', false)
  .describe('watch', 'Watch changes in sources and keep target in sync')
  .number('depth')
  .alias('i', 'depth')
  .default('depth', Infinity)
  .describe('depth', 'Maximum depth if you have performance issues (not everywhere yet: only on existing mirrors and watch scenario)')
  .string('transform')
  .alias('t', 'transform')
  .describe('transform', 'A module name to transform each file. sync-glob lookups the specified name via "require()".')
  .alias('e', 'exit-on-error')
  .default('exit-on-error', true)
  .describe('exit-on-error', 'Exit if an error occurred')
  .boolean('verbose')
  .alias('v', 'verbose')
  .default('verbose', false)
  .describe('verbose', 'Moar output')
  .version()
  .help('help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .epilog('copyright 2016')
  .command(
    'sources', 'One or more globs, files or directories to be mirrored (glob exclusions are supported as well - ! prefix)',
    { alias: 'sources' }
  )
  .command('target', 'Destination folder for mirrored files', { alias: 'target' })
  .demand(2)
  .argv
const _ = argv._
const length = _.length

if (length < 2) {
  // eslint-disable-next-line no-console
  console.error(chalk.bold.red(`Expects exactly two arguments, received ${length}`))
  process.exit(1)
}

const root = process.cwd()
const target = _.pop()
const sources = _
const notifyPriority = {
  'error': 'high',
  'copy': 'normal',
  'remove': 'normal',
  'watch': 'normal',
  'max-depth': 'low',
  'no-delete': 'low',
}

const close = syncGlob(sources, target, {
  watch: argv.watch,
  delete: argv.delete,
  depth: argv.depth || Infinity,
  transform: argv.transform,
}, (event, data) => {
  const priority = notifyPriority[event] || 'low'

  if (!argv.verbose && priority === 'low') {
    return
  }

  switch (event) {

    case 'error':
      // eslint-disable-next-line no-console
      console.error('%s %s', chalk.bold('ERROR'), chalk.bold.red(data.message || data))

      if (argv.exitOnError) {
        if (typeof close === 'function') {
          close()
        }

        process.exit(1)
      }
      break

    case 'copy':
      // eslint-disable-next-line no-console
      console.log('%s %s to %s', chalk.bold('COPY'), chalk.yellow(path.relative(root, data[0])), chalk.yellow(path.relative(root, data[1])))
      break

    case 'mirror':
      // eslint-disable-next-line no-console
      console.log('%s %s to %s', chalk.bold('MIRROR'), chalk.green(data[0]), chalk.green(data[1]))
      break

    case 'remove':
      // eslint-disable-next-line no-console
      console.log('%s %s', chalk.bold('DELETE'), chalk.yellow(path.relative(root, data[1] || data[0])))
      break

    case 'watch':
      // eslint-disable-next-line no-console
      console.log('%s %s', chalk.bold('WATCHING'), chalk.yellow(data))
      break

    case 'max-depth':
      // eslint-disable-next-line no-console
      console.log('%s: %s too deep', chalk.bold.dim('MAX-DEPTH'), chalk.yellow(path.relative(root, data)))
      break

    case 'no-delete':
      // eslint-disable-next-line no-console
      console.log('%s: %s extraneous but not deleted (use %s)',
        chalk.bold.dim('IGNORED'),
        chalk.yellow(path.relative(root, data)),
        chalk.blue('--delete'))
      break

    // Fallback: forgotten logs, displayed only in verbose mode
    default:
      if (argv.verbose) {
        // eslint-disable-next-line no-console
        console.log('%s: %s', chalk.bold(event), data)
      }
  }
})
