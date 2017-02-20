import { copy, deleteExtra, resolveTarget } from './fs'

export const watcherCopy = (target, options, notify) => (file) => {
  copy(file, resolveTarget(file, target, options), options, notify)
}

export const watcherDestroy = (target, options, notify) => (file) => {
  deleteExtra(resolveTarget(file, target, options), options, notify)
}

export const watcherError = (options, notify) => (err) => {
  notify('error', err)
}
