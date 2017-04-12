/* globals process */

import fs from 'fs'
import path from 'path'
import util from 'util'
import globAll from 'glob-all'
import chokidar from 'chokidar'
import Promise, { promisify } from 'bluebird'

import resolveTarget from './lib/resolve-target'
import sourcesBases from './lib/sources-bases'
import isGlob from './lib/is-glob'
import trimQuotes from './lib/trim-quotes'
import { copyDir, copyFile, remove, stat } from './lib/fs'

Promise.config({ cancellation: true })

const defaults = {
  watch: false,
  delete: true,
  depth: Infinity,
  debug: false,
}

/**
 * Synchronise files, directories and/or glob patterns, optionally watching for changes.
 *
 * @param {string|Array.<string>} sources - A list of files, directories and/or glob patterns.
 * @param {string} target - The destination directory.
 * @param {Object} [options] - An optional configuration object.
 * @param {bool} [options.watch=false] - Enable or disable watch mode.
 * @param {bool} [options.delete=true] - Whether to delete the `target`'s content initially.
 * @param {bool} [options.depth=Infinity] - Chokidars `depth` (If set, limits how many levels of subdirectories will be traversed).
 * @param {bool} [options.debug=false] - Log essential information for debugging.
 * @param {string} [options.transform=false] - A module path resolved by node's `require`.
 * @param {NotifyCallback} [notify] - An optional notification callback.
 * @returns {CloseFunc} - Returns a close function which cancels active promises and watch mode.
 */
// eslint-disable-next-line consistent-return
const syncGlob = (sources, target, options = {}, notify = () => {}) => {
  if (!Array.isArray(sources)) {
    // eslint-disable-next-line no-param-reassign
    sources = [sources]
  }
  // eslint-disable-next-line no-param-reassign
  sources = sources.map(trimQuotes)
  const originalTarget = target
  // eslint-disable-next-line no-param-reassign
  target = path.normalize(target)

  if (typeof options === 'function') {
    // eslint-disable-next-line no-param-reassign
    notify = options
    // eslint-disable-next-line no-param-reassign
    options = {}
  }

  // eslint-disable-next-line no-param-reassign
  options = {
    ...defaults,
    ...options,
  }

  const notifyError = (err) => { notify('error', err) }
  const bases = sourcesBases(sources)
  const resolveTargetFromBases = resolveTarget(bases)
  const { depth, watch, debug } = options
  let { transform } = options

  if (typeof depth !== 'number' || isNaN(depth)) {
    notifyError('Expected valid number for option "depth"')
    return false
  }

  if (transform) {
    let transformPath = transform

    try {
      require.resolve(transformPath)
    } catch (err) {
      transformPath = path.join(process.cwd(), transformPath)

      try {
        require.resolve(transformPath)
      } catch (err2) {
        notifyError(err2)
      }
    }

    // eslint-disable-next-line
    transform = require(transformPath)
  }

  // Initial mirror
  const initSources = sources.map(source => (isGlob(source) === -1
  && fs.statSync(path.normalize(source)).isDirectory() ? `${source}${source.slice(-1) === '/' ? '' : '/'}**` : source))
  const mirrorInit = [
    promisify(globAll)(initSources)
      .then(files => files.map(file => path.normalize(file)))
      .then((files) => {
        if (debug) {
          console.log(`sources: ${sources} -> ${initSources}`)
          console.log(`target: ${originalTarget} -> ${target}`)
          console.log(`globed files: \n\t${files.join('\n\t')}`)
        }
        return files
      }),
  ]

  if (options.delete) {
    mirrorInit.push(remove(target)
      .then(() => {
        notify('remove', [target])
      })
      .catch(notifyError)
    )
  } else {
    notify('no-delete', target)
  }

  let mirrorPromiseAll = Promise.all(mirrorInit)
    .then(([files]) => Promise.all(files.map((source) => {
      const resolvedTarget = resolveTargetFromBases(source, target)

      return stat(source)
        .then((stats) => {
          let result

          if (stats.isFile()) {
            result = copyFile(source, resolvedTarget, transform)
          } else if (stats.isDirectory()) {
            result = copyDir(source, resolvedTarget)
          }

          if (result) {
            result = result.then(() => {
              notify('copy', [source, resolvedTarget])
            })
          }

          return result
        })
        .catch(notifyError)
    })))
    .then(() => {
      notify('mirror', [sources, target])
    })
    .catch(notifyError)
    .finally(() => {
      mirrorPromiseAll = null
    })

  let watcher
  let activePromises = []
  const close = () => {
    if (watcher) {
      watcher.close()
      watcher = null
    }

    if (mirrorPromiseAll) {
      mirrorPromiseAll.cancel()
      mirrorPromiseAll = null
    }

    if (activePromises) {
      activePromises.forEach((promise) => {
        promise.cancel()
      })

      activePromises = null
    }
  }

  // Watcher to keep in sync from that
  if (watch) {
    watcher = chokidar.watch(sources, {
      cwd: process.cwd(),
      persistent: true,
      depth,
      ignoreInitial: true,
      // awaitWriteFinish: true,
      usePolling: true,
      useFsEvents: true,
    })

    watcher.on('ready', notify.bind(undefined, 'watch', sources))
      .on('all', (event, source, stats) => {
        const resolvedTarget = resolveTargetFromBases(source, target)
        let promise

        if (debug) {
          console.log(`ALL: ${event} -> ${source} ${stats ? `\t\n${util.inspect(stats)}` : ''}`)
        }

        switch (event) {
          case 'add':
          case 'change':
            promise = copyFile(source, resolvedTarget, transform)
            break

          case 'addDir':
            promise = copyDir(source, resolvedTarget)
            break

          case 'unlink':
          case 'unlinkDir':
            promise = remove(resolvedTarget)
            break

          default:
            return
        }

        activePromises.push(promise
          .then(() => {
            const eventMap = {
              add: 'copy',
              addDir: 'copy',
              change: 'copy',
              unlink: 'remove',
              unlinkDir: 'remove',
            }

            notify(eventMap[event] || event, [source, resolvedTarget])
          })
          .catch(notifyError)
          .finally(() => {
            if (activePromises) {
              const index = activePromises.indexOf(promise)

              if (index !== -1) {
                activePromises.slice(index, 1)
              }
            }

            promise = null
          })
        )
      })
      .on('error', notifyError)

    if (debug) {
      watcher.on('raw', (event, rpath, details) => {
        console.log(`RAW: ${event} -> ${rpath} \t\n${util.inspect(details)}`)
      })
    }

    process.on('SIGINT', close)
    process.on('SIGQUIT', close)
    process.on('SIGTERM', close)
  }

  return close
}

export default syncGlob

/**
 * This callback notifies you about various steps, like:
 * - **copy:** File or directory has been copied to `target`.
 * - **remove:** File or directory has been removed from `target`.
 * - **no-delete:** No initial deletion of `target`s contents.
 * - **mirror:** Initial copy of all `sources` to `target` done.
 * - **watch:** Watch mode has started.
 * - **error:** Any error which may occurred during program execution.
 *
 * @callback NotifyCallback
 * @param {string} type - The type of notification.
 * @param {...any} args - Event specific variadic arguments.
 */

/**
 * A cleanup function which cancels all active promises and closes watch mode if enabled.
 *
 * @typedef {function} CloseFunc
 */
