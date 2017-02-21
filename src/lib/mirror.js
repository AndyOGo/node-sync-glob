import fs from 'fs'
import glob from 'glob-all'

import { copy, deleteExtra, resolveTarget } from './fs'
import isGlob from './is-glob'

const mirror = (sources, target, options, notify) => {
  let flag = true
  const files = glob.sync(sources.map(str => (isGlob(str) === -1 && fs.statSync(str).isDirectory() ? `${str}/**` : str)))

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

  if (flag) {
    notify('mirrored')
  }

  return flag
}

export default mirror
