import fs from 'fs-extra'

import syncGlob from '../src/index'
import { compare, compareDir } from './helpers'

const watch = true

describe('node-sync-glob', () => {
  it('should sync a file', (done) => {
    let hasChanged = false

    const close = syncGlob('test/mock/a.txt', 'tmp', { watch }, compare(() => {
      if (!hasChanged) {
        hasChanged = true
        fs.appendFileSync('test/mock/a.txt', 'foobarbaz')
      } else {
        close()
        done()
      }
    }))
  })
})
