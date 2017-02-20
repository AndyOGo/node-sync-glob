import fs from 'fs-extra'

import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitMatch, compare, compareDir } from './helpers'

const watch = true

describe('node-sync-glob watch', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should sync a file', (done) => {
    const close = syncGlob('tmp/mock/a.txt', 'tmp/sync/', { watch }, awaitMatch(
      'watch', () => {
        fs.appendFileSync('tmp/mock/a.txt', 'foobarbaz')
      },
      'copied', compare(() => {
        fs.removeSync('tmp/mock/a.txt')
      }),
      'removed', () => {
        expect(fs.existsSync('tmp/sync/a.txt')).toBe(false)
        close()
        done()
      }
    ))
  })

  it('should sync an array of files', (done) => {
    const close = syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/sync', { watch }, awaitMatch(
      'watch', () => {
        fs.appendFileSync('tmp/mock/b.txt', 'foobarbaz')
      },
      'copied', compare(() => {
        fs.removeSync('tmp/mock/b.txt')
      }),
      'removed', () => {
        expect(fs.existsSync('tmp/sync/a.txt')).toBe(true)
        expect(fs.existsSync('tmp/sync/b.txt')).toBe(false)
        close()
        done()
      }
    ))
  })

  it('should sync a directory', (done) => {
    const close = syncGlob('tmp/mock/foo', 'tmp/sync/', { watch }, awaitMatch(
      'watch', () => {
        fs.appendFileSync('tmp/mock/foo/b.txt', 'foobarbaz')
      },
      'copied', compareDir(() => {
        setTimeout(() => {
          fs.removeSync('tmp/mock/foo/d.txt')
        })
      }, 'tmp/mock/foo', 'tmp/sync'),
      'removed', () => {
        expect(fs.existsSync('tmp/sync/b.txt')).toBe(true)
        expect(fs.existsSync('tmp/sync/d.txt')).toBe(false)
        close()
        done()
      }
    ))
  })
})
