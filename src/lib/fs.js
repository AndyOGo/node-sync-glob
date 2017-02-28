import fs from 'fs-extra'
import path from 'path'

import promisify from './promisify'

const copy = promisify(fs.copy)
const ensureDir = promisify(fs.ensureDir)
const mkdir = promisify(fs.mkdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export const copyFile = (source, target, transform) => new Promise((resolve) => {
  if (transform) {
    resolve(readFile(source).then((file) => {
      const transformed = transform(file, target)
      const isObject = typeof transformed === 'object'
      const data = (isObject && transformed.data) || transformed
      const newTarget = (isObject && transformed.target) || target

      return mkdir(path.dirname(newTarget)).then(() => writeFile(newTarget, data))
    }))
  } else {
    resolve(copy(source, target))
  }
})

export const copyDir = (source, target) => ensureDir(target)

export const remove = promisify(fs.remove)
