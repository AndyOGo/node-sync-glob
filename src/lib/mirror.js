import path from 'path'
import glob from 'glob-all'

import { copy, deleteExtra } from './fs'

const cwd = process.cwd()

const mirror = (source, target, options, notify) => {
  let flag = true
  const files = glob.sync(source)

  deleteExtra(target, options, notify)

  for (let i = 0, l = files.length; i < l; ++i) {
    const file = files[i]

    if (!copy(file, path.join(target, path.relative(cwd, file)), notify)) {
      flag = false
      break
    }
  }

  return flag
}

export default mirror
