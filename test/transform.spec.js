import fs from 'fs-extra'
import path from 'path'

import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitMatch } from './helpers'

describe('node-sync-glob transform', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should transform a file', (done) => {
    const close = syncGlob('tmp/mock/b.txt', 'tmp/trans', { transform: 'test/mock/transform.js' }, awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', () => {
        expect(fs.existsSync(path.normalize('tmp/trans/b.txt'))).toBe(false)
        expect(fs.existsSync(path.normalize('tmp/trans/b-replaced.txt'))).toBe(true)

        expect(`${fs.readFileSync(path.normalize('tmp/mock/b.txt'))}\n\nTransformed file`).toEqual(`${fs.readFileSync(path.normalize('tmp/trans/b-replaced.txt'))}`)

        close()
        done()
      }
    ))
  })
})
