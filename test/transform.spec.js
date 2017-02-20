import fs from 'fs-extra'

import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitMatch } from './helpers'

describe('node-sync-glob transform', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should transform a file', (done) => {
    syncGlob('tmp/mock/b.txt', 'tmp/trans', { transform: 'test/mock/transform.js' }, awaitMatch(
      'copied', () => {
        expect(fs.existsSync('tmp/trans/b.txt')).toBe(false)
        expect(fs.existsSync('tmp/trans/b-replaced.txt')).toBe(true)

        expect(`${fs.readFileSync('tmp/mock/b.txt')}\n\nTransformed file`).toEqual(`${fs.readFileSync('tmp/trans/b-replaced.txt')}`)
      },
      'mirrored', done
    ))
  })
})
