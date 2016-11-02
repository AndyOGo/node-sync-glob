import glob from 'glob-all'

import { copy, deleteExtra } from './fs'

const mirror = (source, target, options, notify) => {
  const files = glob.sync(source)

  deleteExtra(target, options, notify)

  files.forEach((file) => {
    copy(file, target, notify)
  })
}

export default mirror
