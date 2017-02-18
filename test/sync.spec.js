import fs from 'fs-extra'

import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitMatch, compare, compareDir } from './helpers'

const watch = true

describe('node-sync-glob', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should sync a file', (done) => {
    const close = syncGlob('tmp/mock/a.txt', 'tmp/sync/', { watch }, awaitMatch(
      'watch', (event, data) => {
        fs.appendFileSync('tmp/mock/a.txt', 'foobarbaz')
      },
      'copied', compare(() => {
        close()
        done()
      })
    ))
  })

  it('should sync an array of files', (done) => {
    const close = syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/sync', { watch }, awaitMatch(
      'watch', (event, data) => {
        fs.appendFileSync('tmp/mock/b.txt', 'foobarbaz')
      },
      'copied', compare(() => {
        close()
        done()
      })
    ))
  })

  it('should sync a directory', (done) => {
    const close = syncGlob('tmp/mock/foo', 'tmp/sync/', { watch }, awaitMatch(
      'watch', (event, data) => {
        fs.appendFileSync('tmp/mock/foo/b.txt', 'foobarbaz')
      },
      'copied', compareDir(() => {
        close()
        done()
      }, 'tmp/mock/foo', 'tmp/sync')
    ))
  })
})
