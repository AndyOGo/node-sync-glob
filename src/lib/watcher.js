import path from 'path'

import { copy, deleteExtra } from './fs'

export const watcherCopy = (source, target, options, notify) => (f, stats) => {
  copy(f, path.join(target, path.relative(source, f)), notify)
}

export const watcherDestroy = (source, target, options, notify) => (f) => {
  deleteExtra(path.join(target, path.relative(source, f)), options, notify)
}

export const watcherError = (options, notify) => (err) => {
  notify('error', err)
}
