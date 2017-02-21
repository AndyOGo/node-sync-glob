import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitMatch, compare, compareDir } from './helpers'

describe('node-sync-glob copy', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should copy a file', (done) => {
    syncGlob('tmp/mock/a.txt', 'tmp/copy', {}, awaitMatch(
      'copied', compare(),
      'mirrored', done
    ))
  })

  it('should copy an array of files', (done) => {
    syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/copy', {}, awaitMatch(
      { copied: 2 }, compare(),
      'mirrored', done
    ))
  })

  it('should copy a directory (without contents)', (done) => {
    syncGlob('tmp/mock/foo', 'tmp/copy', {}, awaitMatch(
      'mirrored', compareDir(done, 'tmp/mock/foo', 'tmp/copy')
    ))
    syncGlob('tmp/mock/foo/', 'tmp/copy', {}, awaitMatch(
      'mirrored', compareDir(done, 'tmp/mock/foo/', 'tmp/copy')
    ))
    syncGlob('tmp/mock/@org', 'tmp/copy', {}, awaitMatch(
      'mirrored', compareDir(done, 'tmp/mock/@org', 'tmp/copy')
    ))
    syncGlob('tmp/mock/@org/', 'tmp/copy', {}, awaitMatch(
      'mirrored', compareDir(done, 'tmp/mock/@org/', 'tmp/copy')
    ))
  })

  xit('should copy an array of directories (without contents)', (done) => {
    syncGlob(['tmp/mock/foo', 'tmp/mock/bar/', 'tmp/mock/@org'], 'tmp/copy', {}, awaitMatch(
      'mirrored', compare(done)
    ))
  })

  it('should copy globs', (done) => {
    syncGlob('tmp/mock/@org/*.txt', 'tmp/copy', {}, awaitMatch(
      { copied: 3 }, compare(),
      'mirrored', done
    ))
    syncGlob('tmp/mock/foo/*.txt', 'tmp/copy', {}, awaitMatch(
      { copied: 2 }, compare(),
      'mirrored', done
    ))
  })
})
