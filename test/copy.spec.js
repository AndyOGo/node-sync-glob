import syncGlob from '../src/index'
import { beforeEachSpec, afterAllSpecs, awaitCount, awaitMatch, compare, compareDir, noop, fs } from './helpers'

describe('node-sync-glob copy', () => {
  beforeEach(beforeEachSpec)
  afterAll(afterAllSpecs)

  it('should copy a file', (done) => {
    const close = syncGlob('tmp/mock/a.txt', 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', compare(done, 'tmp/mock/a.txt', 'tmp/copy/a.txt')
    ))
  })

  it('should copy an array of files', (done) => {
    const close = syncGlob(['tmp/mock/a.txt', 'tmp/mock/b.txt'], 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', () => {
        compare(noop, 'tmp/mock/a.txt', 'tmp/copy/a.txt')
        compare(noop, 'tmp/mock/b.txt', 'tmp/copy/b.txt')

        done()
      }
    ))
  })

  it('should copy a directory (without contents)', (done) => {
    const awaitDone = awaitCount(4, done)

    const close = syncGlob('tmp/mock/foo', 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/foo', 'tmp/copy')
    ))
    const close1 = syncGlob('tmp/mock/foo/', 'tmp/copy1', awaitMatch(
      'error', (err) => {
        close1()
        fail(err)
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/foo/', 'tmp/copy1')
    ))
    const close2 = syncGlob('tmp/mock/@org', 'tmp/copy2', awaitMatch(
      'error', (err) => {
        close2()
        fail(err)
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/@org', 'tmp/copy2')
    ))
    const close3 = syncGlob('tmp/mock/@org/', 'tmp/copy3', awaitMatch(
      'error', (err) => {
        close3()
        fail(err)
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/@org/', 'tmp/copy3')
    ))
  })

  xit('should copy an array of directories (without contents)', (done) => {
    const close = syncGlob(['tmp/mock/foo', 'tmp/mock/bar/', 'tmp/mock/@org'], 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', compare(done)
    ))
  })

  it('should copy globs', (done) => {
    const awaitDone = awaitCount(3, done)

    const close = syncGlob('tmp/mock/@org/*.txt', 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/@org', 'tmp/copy')
    ))

    const close1 = syncGlob('tmp/mock/foo/*.txt', 'tmp/copy1', awaitMatch(
      'error', (err) => {
        close1()
        fail(err)
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/foo', 'tmp/copy1')
    ))

    const close2 = syncGlob('tmp/mock/foo space/*.txt', 'tmp/copy 2', awaitMatch(
      'error', (err) => {
        close2()
        fail(err)
        done()
      },
      'mirror', compareDir(awaitDone, 'tmp/mock/foo space', 'tmp/copy 2')
    ))
  })

  it('should copy glob exclusion', (done) => {
    const close = syncGlob(['tmp/mock/foo/*', '!tmp/mock/foo/b.txt'], 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', () => {
        compare(noop, 'tmp/mock/foo/d.txt', 'tmp/copy/d.txt')
        expect(fs.existsSync('tmp/copy/b.txt')).toBe(false)

        done()
      }
    ))
  })

  it('should copy globstar', (done) => {
    const close = syncGlob('tmp/mock/**/*', 'tmp/copy', awaitMatch(
      'error', (err) => {
        fail(err)
        close()
        done()
      },
      'mirror', compareDir(done, 'tmp/mock', 'tmp/copy')
    ))
  })
})
