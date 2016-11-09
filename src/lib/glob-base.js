import fs from 'fs'
import path from 'path'

import isGlob from './is-glob'

const globBase = (glob) => {
  if (!Array.isArray(glob)) {
    glob = [glob]
  }

  return glob.reduce((base, pattern) => {
    if (pattern.charAt(0) === '!') {
      return base
    }

    const index = isGlob(pattern)

    if (index > -1) {
      pattern = pattern.substring(0, index)
    }

    if (index > -1 || fs.statSync(pattern).isFile()) {
      pattern = path.dirname(pattern)
    }

    base.push(pattern)

    return base
  }, [])
}

export default globBase
