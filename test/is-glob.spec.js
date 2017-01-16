import isGlob from '../src/lib/is-glob'

const isGloby = value => !!~isGlob(value)

describe('lib/is-glib', () => {
  it('should match asterisk wildcard', () => {
    expect(isGloby('*')).toBe(true)
    expect(isGloby('*.js')).toBe(true)
    expect(isGloby('/*.js')).toBe(true)
  })

  it('should match globstar wildcard', () => {
    expect(isGloby('**')).toBe(true)
    expect(isGloby('**/*.js')).toBe(true)
  })

  it('should match question mark wildcard', () => {
    expect(isGloby('?')).toBe(true)
    expect(isGloby('?.js')).toBe(true)
    expect(isGloby('/?.js')).toBe(true)
  })

  it('should match range wildcards', () => {
    expect(isGloby('[a-z]')).toBe(true)
    expect(isGloby('[a-z].js')).toBe(true)
    expect(isGloby('/[a-z]')).toBe(true)
    expect(isGloby('[!a-z]')).toBe(true)
    expect(isGloby('[^a-z]')).toBe(true)
  })

  it('should match extended globs', () => {
    expect(isGloby('!(a|b|c)')).toBe(true)
    expect(isGloby('?(a|b|c)')).toBe(true)
    expect(isGloby('+(a|b|c)')).toBe(true)
    expect(isGloby('*(a|b|c)')).toBe(true)
    expect(isGloby('@(a|b|c)')).toBe(true)
  })
})
