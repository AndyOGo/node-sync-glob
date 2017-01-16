import fs from 'fs-extra'
import dirCompare from 'dir-compare'

import syncGlob from '../src/index'

describe('node-sync-glob', () => {
  beforeEach(() => {
    fs.removeSync('tmp')
  })

  it('should copy a file', (done) => {
    syncGlob('test/mock/a.txt', 'tmp', {}, (event, data) => {
      const isCopy = event === 'copy'
      const isCopied = event === 'copied'
      const isNoDelete = event === 'no-delete'

      expect(isCopy || isCopied || isNoDelete).toBe(true)

      if (isCopied) {
        const res = dirCompare.compareSync(data[0], data[1], { compareSize: true, compareContent: true })

        expect(res.differences).toBe(0)
        expect(res.differencesFiles).toBe(0)
        expect(res.distinctFiles).toBe(0)
        expect(res.differencesDirs).toBe(0)
        expect(res.distinctDirs).toBe(0)

        done()
      }
    })
  })

  it('should copy an array of files', () => {

  })

  it('should copy a directory', () => {

  })

  it('should copy an array of directories', () => {

  })
})
