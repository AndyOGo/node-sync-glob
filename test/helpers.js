import fs from 'fs-extra'
import dirCompare from 'dir-compare'

export const beforeEachSpec = () => {
  fs.removeSync('tmp')
  fs.copySync('test/mock', 'tmp/mock')
}

export const afterAllSpecs = () => {
  fs.removeSync('tmp')
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

  return (event, data) => {
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

export const compare = (done, options) => (event, data) => {
  if (event && Array.isArray(data)) {
    const [source, target] = data
    const res = dirCompare.compareSync(source, target, { ...options, compareSize: true, compareContent: true })

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

export const compareDir = (done, source, target, options) => (event) => {
  if (event) {
    const res = dirCompare.compareSync(source, target, { ...options, compareSize: true, compareContent: true })

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
