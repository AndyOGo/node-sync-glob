import fs from 'fs-extra'

import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, compare, compareDir } from './helpers'

const watch = true

describe('node-sync-glob', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should sync a file', (done) => {
    let hasChanged = false

    const close = syncGlob('tmp/mock/a.txt', 'tmp/sync/', { watch }, compare((event) => {
      if (event === 'watch') {
        setImmediate(() => {
          hasChanged = true
          fs.appendFileSync('tmp/mock/a.txt', 'foobarbaz')
        })

        return
      }

      if (hasChanged) {
        close()
        done()
      }
    }))
  })

  it('should sync an array of files', (done) => {
    let hasChanged = false

    const close = syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/sync', { watch }, compare((event) => {
      if (event === 'watch') {
        setImmediate(() => {
          hasChanged = true
          fs.appendFileSync('tmp/mock/b.txt', 'foobarbaz')
        })

        return
      }

      if (hasChanged) {
        close()
        done()
      }
    }))
  })

  it('should sync a directory', (done) => {
    let hasChanged = false

    const close = syncGlob('tmp/mock/foo', 'tmp/sync/', { watch }, compareDir((event) => {
      if (event === 'watch') {
        setImmediate(() => {
          hasChanged = true
          fs.appendFileSync('tmp/mock/foo/b.txt', 'foobarbaz')
        })

        return
      }

      if (hasChanged) {
        close()
        done()
      }
    }, 'tmp/mock/foo', 'tmp/sync'))
  })
})
