import fs from 'fs-extra'
import dirCompare from 'dir-compare'

import syncGlob from '../src/index'

const compare = done => (event, data) => {
  if (event === 'copied') {
    const [source, target] = data
    const res = dirCompare.compareSync(source, target, { compareSize: true, compareContent: true })

    expect(res.differences).toBe(0)
    expect(res.differencesFiles).toBe(0)
    expect(res.distinctFiles).toBe(0)
    expect(res.differencesDirs).toBe(0)
    expect(res.distinctDirs).toBe(0)

    done()
  }
}

const compareDir = (done, source, target) => (event) => {
  if (event === 'mirrored') {
    const res = dirCompare.compareSync(source, target, { compareSize: true, compareContent: true })

    expect(res.differences).toBe(0)
    expect(res.differencesFiles).toBe(0)
    expect(res.distinctFiles).toBe(0)
    expect(res.differencesDirs).toBe(0)
    expect(res.distinctDirs).toBe(0)

    done()
  }
}

describe('node-sync-glob', () => {
  beforeEach(() => {
    fs.removeSync('tmp')
  })

  afterAll(() => {
    fs.removeSync('tmp')
  })

  it('should copy a file', (done) => {
    syncGlob('test/mock/a.txt', 'tmp', {}, compare(done))
  })

  it('should copy an array of files', (done) => {
    syncGlob(['test/mock/a.txt', 'test/mock/b.txt'], 'tmp', {}, compare(done))
  })

  it('should copy a directory (without contents)', (done) => {
    syncGlob('test/mock/foo', 'tmp', {}, compareDir(done, 'test/mock/foo', 'tmp'))
    syncGlob('test/mock/foo/', 'tmp', {}, compareDir(done, 'test/mock/foo/', 'tmp'))
    syncGlob('test/mock/@org', 'tmp', {}, compareDir(done, 'test/mock/@org', 'tmp'))
    syncGlob('test/mock/@org/', 'tmp', {}, compareDir(done, 'test/mock/@org/', 'tmp'))
  })

  xit('should copy an array of directories (without contents)', (done) => {
    syncGlob(['test/mock/foo', 'test/mock/bar/', 'test/mock/@org'], 'tmp', {}, compare(done))
  })

  it('should copy globs', (done) => {
    syncGlob('test/mock/@org/*.txt', 'tmp', {}, compare(done))
    syncGlob('test/mock/foo/*.txt', 'tmp', {}, compare(done))
  })
})
