import fs from 'fs'
import path from 'path'

import isGlob from './is-glob'

const reDir = /\/|\\/

/**
 * Determine the base paths of `sources` like:
 * - **files:** `foo/bar.txt` -> `foo`
 * - **directories:** `foo/bar/` -> `foo/bar`
 * - **globs:** `foo/*` -> `foo`
 *
 * @param {string|Array.<string>} sources - One or more files, directors or glob patterns.
 * @returns {Array.<string>} - Returns the base paths of `sources`.
 */
const sourcesBases = (sources) => {
  if (!Array.isArray(sources)) {
    // eslint-disable-next-line no-param-reassign
    sources = [sources]
  }

  return sources.reduce((bases, pattern) => {
    if (pattern.charAt(0) === '!') {
      return bases
    }

    const index = isGlob(pattern)
    const foundGlob = index > -1
    let isDir

    if (index > -1) {
      const charBeforeGlob = pattern.charAt(index - 1)

      isDir = reDir.test(charBeforeGlob)
      // eslint-disable-next-line no-param-reassign
      pattern = pattern.substring(0, index)
    }

    if (pattern) {
      if ((foundGlob && !isDir) ||
        (!foundGlob && fs.statSync(pattern).isFile())) {
        // eslint-disable-next-line no-param-reassign
        pattern = path.dirname(pattern)
      } else if (reDir.test(pattern.charAt(pattern.length - 1))) {
        // eslint-disable-next-line no-param-reassign
        pattern = pattern.slice(0, -1)
      }
    }

    if (bases.indexOf(pattern) === -1) {
      bases.push(pattern)
    }

    return bases
  }, [])
}

export default sourcesBases
