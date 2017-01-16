import fs from 'fs'
import path from 'path'

import isGlob from './is-glob'

const reDir = /\/|\\/

const globBase = (glob) => {
  if (!Array.isArray(glob)) {
    glob = [glob]
  }

  return glob.reduce((base, pattern) => {
    if (pattern.charAt(0) === '!') {
      return base
    }

    const index = isGlob(pattern)
    const foundGlob = index > -1
    let isDir

    if (index > -1) {
      const charBeforeGlob = pattern.charAt(index - 1)

      isDir = reDir.test(charBeforeGlob)
      pattern = pattern.substring(0, index)
    }

    if (pattern) {
      if (foundGlob && !isDir ||
        !foundGlob && fs.statSync(pattern).isFile()) {
        pattern = path.dirname(pattern)
      } else if (reDir.test(pattern.charAt(pattern.length - 1))) {
        pattern = pattern.slice(0, -1)
      }
    }

    base.push(pattern)

    return base
  }, [])
}

export default globBase
