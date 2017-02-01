import syncGlob from '../src/index'
import { setup, compare, compareDir } from './helpers'

setup()

describe('node-sync-glob', () => {
  it('should copy a file', (done) => {
    syncGlob('tmp/mock/a.txt', 'tmp/copy', {}, compare(done))
  })

  it('should copy an array of files', (done) => {
    syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/copy', {}, compare(done))
  })

  it('should copy a directory (without contents)', (done) => {
    syncGlob('tmp/mock/foo', 'tmp/copy', {}, compareDir(done, 'tmp/mock/foo', 'tmp/copy'))
    syncGlob('tmp/mock/foo/', 'tmp/copy', {}, compareDir(done, 'tmp/mock/foo/', 'tmp/copy'))
    syncGlob('tmp/mock/@org', 'tmp/copy', {}, compareDir(done, 'tmp/mock/@org', 'tmp/copy'))
    syncGlob('tmp/mock/@org/', 'tmp/copy', {}, compareDir(done, 'tmp/mock/@org/', 'tmp/copy'))
  })

  xit('should copy an array of directories (without contents)', (done) => {
    syncGlob(['tmp/mock/foo', 'tmp/mock/bar/', 'tmp/mock/@org'], 'tmp/copy', {}, compare(done))
  })

  it('should copy globs', (done) => {
    syncGlob('tmp/mock/@org/*.txt', 'tmp/copy', {}, compare(done))
    syncGlob('tmp/mock/foo/*.txt', 'tmp/copy', {}, compare(done))
  })
})
