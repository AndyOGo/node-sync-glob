import fs from 'fs-extra'
import path from 'path'
import Promise, { promisify } from 'bluebird'

Promise.config({ cancellation: true })

const copy = promisify(fs.copy)
const ensureDir = promisify(fs.ensureDir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

/**
 * Copy file from `source` to `target`.
 *
 * @param {string} source - A file to be copied.
 * @param {string} target - A destination path where to copy.
 * @param {TransformFunc} [transform] - Optional transformation function.
 * @returns {Promise}
 */
export const copyFile = (source, target, transform) => new Promise((resolve) => {
  if (transform) {
    resolve(readFile(source).then((file) => {
      const transformed = transform(file, target)
      const isObject = typeof transformed === 'object'
      const data = (isObject && transformed.data) || transformed
      const newTarget = (isObject && transformed.target) || target

      return ensureDir(path.dirname(newTarget)).then(() => writeFile(newTarget, data))
    }))
  } else {
    resolve(ensureDir(path.dirname(target)).then(() => {
      console.log(`##+++*** copy ${source} -> ${target}`)

      return copy(source, target)
    }))
  }
})

/**
 * Copy a directory from `source` to `target` (w/o contents).
 *
 * @param {string} source - A directory to be copied.
 * @param {string} target - A destination path where to copy.
 * @returns {Promise}
 */
export const copyDir = (source, target) => ensureDir(target)

/**
 * Remove a file or directory.
 *
 * @param {string} fileordir - The file or directory to remove.
 * @returns {Promise}
 */
export const remove = promisify(fs.remove)

export const stat = promisify(fs.stat)

/**
 * A custom function which transforms a given `file` contents and/or `target`.
 *
 * @typedef {function} TransformFunc
 * @param {File} file - A file object obtained by `fs.readFile`.
 * @param {string} target - The destination where to copy this `file`.
 * @returns {File|{data: File, target: string}} - Returns the transformed `file` and/or renamed `target`.
 */
