import glob from 'glob-all'

import { copy, deleteExtra } from './fs'

const mirror = (source, target, options, notify) => {
  let flag = true
  const files = glob.sync(source)

  deleteExtra(target, options, notify)

  for (let i = 0, l = files.length; i < l; ++i) {
    if (!copy(files[i], target, notify)) {
      flag = false
      break;
    }
  }

  return flag
}

export default mirror
