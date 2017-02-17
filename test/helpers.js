import fs from 'fs-extra'
import dirCompare from 'dir-compare'

export const beforeEachSpec = () => {
  fs.removeSync('tmp')
  fs.copySync('test/mock', 'tmp/mock')
}

export const afterAllSpecs = () => {
  fs.removeSync('tmp')
}

export const compare = (done, options) => {
  let isWatching = false

  return function (event, data) {
    if (event === 'watch') {
      isWatching = true
      done(event)
    } else if ((event === 'copied' || isWatching && event) && Array.isArray(data)) {
      const [source, target] = data
      const res = dirCompare.compareSync(source, target, { ...options, compareSize: true, compareContent: true })

      expect(res.differences).toBe(0)
      expect(res.differencesFiles).toBe(0)
      expect(res.distinctFiles).toBe(0)
      expect(res.differencesDirs).toBe(0)
      expect(res.distinctDirs).toBe(0)

      done(event)
    }
  }
}

export const compareDir = (done, source, target, options) => {
  let isWatching = false

  return (event) => {
    if (event === 'watch') {
      isWatching = true
      done(event)
    } else if (event === 'mirrored' || isWatching && event) {
      const res = dirCompare.compareSync(source, target, { ...options, compareSize: true, compareContent: true })

      expect(res.differences).toBe(0)
      expect(res.differencesFiles).toBe(0)
      expect(res.distinctFiles).toBe(0)
      expect(res.differencesDirs).toBe(0)
      expect(res.distinctDirs).toBe(0)

      done(event)
    }
  }
}
