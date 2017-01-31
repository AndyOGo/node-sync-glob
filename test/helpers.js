import dirCompare from 'dir-compare'

export const compare = (done, options) => (event, data) => {
  if (event === 'copied') {
    const [source, target] = data
    const res = dirCompare.compareSync(source, target, { ...options, compareSize: true, compareContent: true })

    expect(res.differences).toBe(0)
    expect(res.differencesFiles).toBe(0)
    expect(res.distinctFiles).toBe(0)
    expect(res.differencesDirs).toBe(0)
    expect(res.distinctDirs).toBe(0)

    done()
  }
}

export const compareDir = (done, source, target, options) => (event) => {
  if (event === 'mirrored') {
    const res = dirCompare.compareSync(source, target, { ...options, compareSize: true, compareContent: true })

    expect(res.differences).toBe(0)
    expect(res.differencesFiles).toBe(0)
    expect(res.distinctFiles).toBe(0)
    expect(res.differencesDirs).toBe(0)
    expect(res.distinctDirs).toBe(0)

    done()
  }
}
