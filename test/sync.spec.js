import fs from 'fs-extra'

import syncGlob from '../src/index'
import { compare, compareDir } from './helpers'

describe('node-sync-glob', () => {
  it('should sync a file', (done) => {
    let hasChanged = false

    syncGlob('test/mock/a.txt', 'tmp', { watch: true }, compare(() => {
      if (!hasChanged) {
        hasChanged = true
        fs.appendFileSync('test/mock/a.txt', 'foobarbaz')
      } else {
        done()
      }
    }))
  })
})
