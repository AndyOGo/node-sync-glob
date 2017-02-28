/* globals process */

import fs from 'fs'
import path from 'path'
import globAll from 'glob-all'
import chokidar from 'chokidar'

import resolveTarget from './lib/resolve-target'
import globBases from './lib/glob-bases'
import isGlob from './lib/is-glob'
import promisify from './lib/promisify'
import trimQuotes from './lib/trim-quotes'
import { copyDir, copyFile, remove } from './lib/fs'

const defaults = {
  watch: false,
  delete: true,
  depth: Infinity,
}

// eslint-disable-next-line consistent-return
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
    ...options,
  }

  const notifyError = (err) => { notify('error', err) }
  const bases = globBases(sources)
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
      && fs.statSync(source).isDirectory() ? `${source}/**` : source))),
  ]

  if (options.delete) {
    mirrorInit.push(remove(target).then(() => {
      notify('remove', target)
    }, notifyError))
  } else {
    notify('no-delete', target)
  }

  Promise.all(mirrorInit)
    .then(([files]) => Promise.all(files.map((file) => {
      const resolvedTarget = resolveTargetFromBases(file, target)

      return copyFile(file, resolvedTarget, transform).then(() => {
        notify('copy', [file, resolvedTarget])
      }, notifyError)
    }))).then(() => {
      notify('mirror', [sources, target])
    }, notifyError)

  // Watcher to keep in sync from that
  if (watch) {
    let watcher = chokidar.watch(sources, {
      persistent: true,
      depth,
      ignoreInitial: true,
      awaitWriteFinish: true,
    })
    const closeWatcher = () => {
      if (watcher) {
        watcher.close()
        watcher = null
      }
    }

    watcher.on('ready', notify.bind(undefined, 'watch', sources))
      .on('all', (event, source) => {
        const resolvedTarget = resolveTargetFromBases(source, target)
        let promise

        // eslint-disable-next-line default-case
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
        }

        promise.then(() => {
          const eventMap = {
            add: 'copy',
            addDir: 'copy',
            change: 'copy',
            unlink: 'remove',
            unlinkDir: 'remove',
          }

          notify(eventMap[event] || event, [source, resolvedTarget])
        }, notifyError)
      })
      .on('error', notifyError)

    process.on('SIGINT', closeWatcher)
    process.on('SIGQUIT', closeWatcher)
    process.on('SIGTERM', closeWatcher)

    return closeWatcher
  }
}

export default syncGlob
