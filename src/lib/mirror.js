import fs from 'fs'
import glob from 'glob-all'

import { copy, deleteExtra } from './fs'
import resolveTarget from './resolve-target'
import isGlob from './is-glob'

const mirror = (sources, target, options) => {
  let flag = true
  const files = glob.sync(sources.map(source => (isGlob(source) === -1 && fs.statSync(source).isDirectory() ? `${source}/**` : source)))

  if (options.deleteInitial) {
    deleteExtra(target, options, notify)
  }

  for (let i = 0, l = files.length; i < l; ++i) {
    const file = files[i]

    if (!copy(file, resolveTarget(file, target, options), options, notify)) {
      flag = false
      break
    }
  }

  return flag
}

export default mirror

const mirror = (sources, target, options) => {
  resolveTarget = resolveTarget(options.base)

  const promise = new Promise((resolve, reject) => {

  })

  return promise
}
