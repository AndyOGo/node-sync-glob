import glob from 'glob-all'

import { copy, deleteExtra, resolveTarget } from './fs'

const mirror = (source, target, options, notify) => {
  let flag = true
  const files = glob.sync(source)

  deleteExtra(target, options, notify)

  for (let i = 0, l = files.length; i < l; ++i) {
    const file = files[i]

    if (!copy(file, resolveTarget(file, target, options), notify, true)) {
      flag = false
      break
    }
  }

  return flag
}

export default mirror
