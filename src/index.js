import chokidar from 'chokidar'

import mirror from './lib/mirror'
import { watcherCopy, watcherDestroy, watcherError } from './lib/watcher'

const defaults = {
  watch: false,
  delete: false,
  depth: Infinity,
}

const syncGlob = (source, target, options, notify) => {
  options = {
    ...defaults,
    ...options,
  }

  if (typeof options.depth !== 'number' || isNaN(options.depth)) {
    notify('error', 'Expected valid number for option "depth"')
    return false
  }
  // Initial mirror
  const mirrored = mirror(source, target, options, notify, 0)

  if (!mirrored) {
    return false
  }

  if (options.watch) {
    // Watcher to keep in sync from that
    chokidar.watch(source, {
      persistent: true,
      depth: options.depth,
      ignoreInitial: true,
    })
      .on('ready', notify.bind(undefined, 'watch', source))
      .on('add', watcherCopy(target, options, notify))
      .on('addDir', watcherCopy(target, options, notify))
      .on('change', watcherCopy(target, options, notify))
      .on('unlink', watcherDestroy(target, options, notify))
      .on('unlinkDir', watcherDestroy(target, options, notify))
      .on('error', watcherError(options, notify))
  }
}

export default syncGlob
