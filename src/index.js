/* globals process */

import path from 'path'
import chokidar from 'chokidar'

import globBase from './lib/glob-base'
import mirror from './lib/mirror'
import trimQuotes from './lib/trim-quotes'
import { watcherCopy, watcherDestroy, watcherError } from './lib/watcher'

const defaults = {
  watch: false,
  delete: true,
  deleteInitial: false,
  depth: Infinity,
}

const syncGlob = (sources, target, options, notify) => {
  if (!Array.isArray(sources)) {
    // eslint-disable-next-line no-param-reassign
    sources = [sources]
  }
  // eslint-disable-next-line no-param-reassign
  sources = sources.map(trimQuotes)
  // eslint-disable-next-line no-param-reassign
  options = {
    ...defaults,
    base: globBase(sources),
    ...options,
  }

  if (typeof options.depth !== 'number' || isNaN(options.depth)) {
    notify('error', 'Expected valid number for option "depth"')
    return false
  }

  if (options.transform) {
    let transformPath = options.transform

    try {
      require.resolve(transformPath)
    } catch (e) {
      transformPath = path.join(process.cwd(), transformPath)
    }

    // eslint-disable-next-line
    options.transform = require(transformPath)
  }

  // Initial mirror
  const mirrored = mirror(sources, target, options, notify, 0)
  let watcher

  if (!mirrored) {
    notify('error', 'Initial mirror failed')
    return false
  }

  if (options.watch) {
    // Watcher to keep in sync from that
    watcher = chokidar.watch(sources, {
      persistent: true,
      depth: options.depth,
      ignoreInitial: true,
    })
      .on('ready', notify.bind(undefined, 'watch', sources))
      .on('add', watcherCopy(target, options, notify))
      .on('addDir', watcherCopy(target, options, notify))
      .on('change', watcherCopy(target, options, notify))
      .on('unlink', watcherDestroy(target, options, notify))
      .on('unlinkDir', watcherDestroy(target, options, notify))
      .on('error', watcherError(options, notify))
      .on('all', (...args) => {
        console.log(`***CHOKIDAR: ${args.join(', ')}***`)
      })

    process.on('SIGINT', stopWatching)
    process.on('SIGQUIT', stopWatching)
    process.on('SIGTERM', stopWatching)
  }

  return stopWatching

  function stopWatching() {
    if (watcher) {
      watcher.close()
      watcher = null
    }
  }
}

export default syncGlob
