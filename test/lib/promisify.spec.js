import promisify from '../../src/lib/promisify'

const isPromise = obj => typeof obj === 'object' &&
  typeof obj.then === 'function' &&
  typeof obj.catch === 'function'

describe('lib/promisify', () => {
  it('should tranform first-error API to promise', () => {
    const strutPromise = promisify(strut)()
    const noop = () => {}

    strutPromise.then(noop).catch(noop)

    expect(isPromise(strutPromise)).toBe(true)
  })

  it('should resolve', (done) => {
    const strutAsync = promisify(strut)

    strutAsync('foo').then((result) => {
      expect(result).toBe('foo')
      done()
    }).catch(() => {
      fail('should not reject')
      done()
    })
  })

  it('should reject', (done) => {
    const strutAsync = promisify(strut)

    strutAsync(null).then(() => {
      fail('should not resolve')
      done()
    }).catch((err) => {
      expect(err.message).toBe('a should be truthy')
      done()
    })
  })
})

function strut(a, cb) {
  if (a) cb(null, a)
  else cb(new Error('a should be truthy'))
}
