import path from 'path'

import { copy, deleteExtra } from './fs'

export const watcherCopy = (source, target, options, notify) => (file, stats) => {
  copy(file, path.join(target, path.relative(source, file)), notify)
}

export const watcherDestroy = (source, target, options, notify) => (file) => {
  deleteExtra(path.join(target, path.relative(source, file)), options, notify)
}

export const watcherError = (options, notify) => (err) => {
  notify('error', err)
}
