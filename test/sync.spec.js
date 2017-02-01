import fs from 'fs-extra'

import syncGlob from '../src/index'
import { setup, compare, compareDir } from './helpers'

const watch = true

setup()

describe('node-sync-glob', () => {
  it('should sync a file', (done) => {
    let hasChanged = false

    const close = syncGlob('tmp/mock/a.txt', 'tmp/sync', { watch }, compare(() => {
      if (!hasChanged) {
        hasChanged = true
        fs.appendFileSync('tmp/mock/a.txt', 'foobarbaz')
      } else {
        close()
        done()
      }
    }))
  })
})
