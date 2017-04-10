/* globals process */

import fs from 'fs'
import path from 'path'
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

  console.log('+++++++++++')
  console.log(bases)
  const resolveTargetFromBases = resolveTarget(bases)
  const { depth, watch } = options
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
  const mirrorInit = [
    promisify(globAll)(sources.map(source => (isGlob(source) === -1
      && fs.statSync(source).isDirectory() ? `${source}/**` : source)))
      .then(files => files.map(file => path.normalize(file))),
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

    activePromises.forEach((promise) => {
      promise.cancel()
    })

    activePromises = null
  }

  // Watcher to keep in sync from that
  if (watch) {
    watcher = chokidar.watch(sources, {
      persistent: true,
      depth,
      ignoreInitial: true,
      awaitWriteFinish: true,
    })

    watcher.on('ready', notify.bind(undefined, 'watch', sources))
      .on('all', (event, source) => {
        const resolvedTarget = resolveTargetFromBases(source, target)
        let promise

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
