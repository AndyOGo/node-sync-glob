import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitCount, awaitMatch, compare, compareDir } from './helpers'

describe('node-sync-glob copy', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should copy a file', (done) => {
    syncGlob('tmp/mock/a.txt', 'tmp/copy', {}, awaitMatch(
      'copy', compare(),
      'mirror', done
    ))
  })

  it('should copy an array of files', (done) => {
    syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/copy', {}, awaitMatch(
      { copy: 2 }, compare(),
      'mirror', done
    ))
  })

  it('should copy a directory (without contents)', (done) => {
    const awaitDone = awaitCount(4, done)

    syncGlob('tmp/mock/foo', 'tmp/copy', {}, awaitMatch(
      'mirror', compareDir(awaitDone, 'tmp/mock/foo', 'tmp/copy')
    ))
    syncGlob('tmp/mock/foo/', 'tmp/copy1', {}, awaitMatch(
      'mirror', compareDir(awaitDone, 'tmp/mock/foo/', 'tmp/copy1')
    ))
    syncGlob('tmp/mock/@org', 'tmp/copy2', {}, awaitMatch(
      'mirror', compareDir(awaitDone, 'tmp/mock/@org', 'tmp/copy2')
    ))
    syncGlob('tmp/mock/@org/', 'tmp/copy3', {}, awaitMatch(
      'mirror', compareDir(awaitDone, 'tmp/mock/@org/', 'tmp/copy3')
    ))
  })

  xit('should copy an array of directories (without contents)', (done) => {
    syncGlob(['tmp/mock/foo', 'tmp/mock/bar/', 'tmp/mock/@org'], 'tmp/copy', {}, awaitMatch(
      'mirror', compare(done)
    ))
  })

  it('should copy globs', (done) => {
    syncGlob('tmp/mock/@org/*.txt', 'tmp/copy', {}, awaitMatch(
      { copy: 3 }, compare(),
      'mirror', done
    ))
    syncGlob('tmp/mock/foo/*.txt', 'tmp/copy1', {}, awaitMatch(
      { copy: 2 }, compare(),
      'mirror', done
    ))
  })
})
