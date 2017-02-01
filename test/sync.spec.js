import fs from 'fs-extra'

import syncGlob from '../src/index'
import { setup, compare, compareDir } from './helpers'

const watch = true

setup()

describe('node-sync-glob', () => {
  it('should sync a file', (done) => {
    let hasChanged = false

    const close = syncGlob('tmp/mock/a.txt', 'tmp/sync/', { watch }, compare(() => {
      if (!hasChanged) {
        hasChanged = true

        setImmediate(() => {
          fs.appendFileSync('tmp/mock/a.txt', 'foobarbaz')
        })
      } else {
        close()
        done()
      }
    }))
  }, 10000)

  it('should sync an array of files', (done) => {
    let hasChanged = 0

    const close = syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/sync', { watch }, compare(() => {
      if (hasChanged++ === 1) {
        setImmediate(() => {
          fs.appendFileSync('tmp/mock/b.txt', 'foobarbaz')
        })
      } else if (hasChanged > 1) {
        close()
        done()
      }
    }))
  }, 10000)
})
