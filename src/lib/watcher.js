import path from 'path'

import { copy, deleteExtra } from './fs'

const cwd = process.cwd()

export const watcherCopy = (target, options, notify) => (file, stats) => {
  copy(file, path.join(target, path.relative(cwd, file)), notify)
}

export const watcherDestroy = (target, options, notify) => (file) => {
  deleteExtra(path.join(target, path.relative(cwd, file)), options, notify)
}

export const watcherError = (options, notify) => (err) => {
  notify('error', err)
}
