import fsExtra from 'fs-extra'
import path from 'path'
import dirCompare from 'dir-compare'

export const noop = () => {}

export const fs = {
  removeSync: source => fsExtra.removeSync(path.normalize(source)),
  copySync: (source, target) => fsExtra.copySync(path.normalize(source), path.normalize(target)),
  appendFileSync: (source, ...args) => fsExtra.appendFileSync(path.normalize(source), ...args),
  existsSync: source => fsExtra.existsSync(path.normalize(source)),
  readFileSync: source => fsExtra.readFileSync(path.normalize(source)),
}

export const beforeEachSpec = () => {
  fs.removeSync('tmp')
  fs.copySync('test/mock', 'tmp/mock')
}

export const afterAllSpecs = () => {
  fs.removeSync('tmp')
}

export const awaitCount = (limit, done) => {
  let count = 0

  return () => {
    // eslint-disable-next-line no-plusplus
    if (++count === limit) done()
  }
}

export const awaitMatch = (...args) => {
  if (args.length % 2) {
    throw new Error('Args arity must be sets of two')
  }

  const normalizeMatch = (match) => {
    if (!Array.isArray(match)) {
      // eslint-disable-next-line no-param-reassign
      match = [match]
    }

    return match.reduce((matches, value) => {
      if (typeof value === 'object') {
        Object.keys(value).forEach((key) => {
          const count = value[key]

          for (let i = 0; i < count; i++) {
            matches.push(key)
          }
        })
      } else {
        matches.push(value)
      }

      return matches
    }, [])
  }
  let match = normalizeMatch(args.shift())
  let callback = args.shift()
  let onError

  if (match[0] === 'error') {
    onError = callback

    if (args.length) {
      match = normalizeMatch(args.shift())
      callback = args.shift()
    }
  }

  return (event, data) => {
    if (event === 'error') {
      // eslint-disable-next-line no-console
      console.error(`${event} -> ${data}`)
      if (data.stack) {
        // eslint-disable-next-line no-console
        console.log(data.stack)
      }

      if (onError) {
        onError(data)
      }
      return
    }

    if (!match.length && !args.length) {
      return
    }

    const index = match.indexOf(event)

    if (index > -1) {
      match.splice(index, 1)
    }

    if (match.length === 0) {
      callback(event, data)

      if (args.length) {
        match = normalizeMatch(args.shift())
        callback = args.shift()
      }
    }
  }
}

export const compare = (done, source, target, options) => (event, data) => {
  if (event) {
    if (Array.isArray(data) && data.length === 2
      && typeof data[0] === 'string' && typeof data[1] === 'string') {
      // eslint-disable-next-line no-param-reassign
      [source, target] = data
    }

    const res = dirCompare.compareSync(source, target, {
      ...options,
      compareSize: true,
      compareContent: true,
    })

    expect(res.differences).toBe(0)
    expect(res.differencesFiles).toBe(0)
    expect(res.distinctFiles).toBe(0)
    expect(res.differencesDirs).toBe(0)
    expect(res.distinctDirs).toBe(0)

    if (done) {
      done()
    }
  }
}

export const compareDir = (done, source, target, options = {}) => (event) => {
  if (event) {
    const res = dirCompare.compareSync(source, target, {
      ...options,
      compareSize: true,
      compareContent: true,
    })

    expect(res.differences).toBe(0)
    expect(res.differencesFiles).toBe(0)
    expect(res.distinctFiles).toBe(0)
    expect(res.differencesDirs).toBe(0)
    expect(res.distinctDirs).toBe(0)

    if (done) {
      done()
    }
  }
}
