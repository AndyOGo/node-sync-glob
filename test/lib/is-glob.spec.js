import isGlob from '../../src/lib/is-glob'

// eslint-disable-next-line no-bitwise
const isGloby = value => !!~isGlob(value)

describe('lib/is-glob', () => {
  describe('truthy', () => {
    it('should match asterisk wildcard', () => {
      expect(isGloby('*')).toBe(true)
      expect(isGloby('*.js')).toBe(true)
      expect(isGloby('/*.js')).toBe(true)
    })

    it('should match globstar wildcard', () => {
      expect(isGloby('**')).toBe(true)
      expect(isGloby('**/a.js')).toBe(true)
    })

    it('should match question mark wildcard', () => {
      expect(isGloby('?')).toBe(true)
      expect(isGloby('?.js')).toBe(true)
      expect(isGloby('/?.js')).toBe(true)
    })

    it('should match braced sections', () => {
      expect(isGloby('{a,b}')).toBe(true)
      expect(isGloby('abc/{a,b}')).toBe(true)
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

    it('should match glob exclusion', () => {
      expect(isGloby('!foo')).toBe(true)
      expect(isGloby('!foo/bar')).toBe(true)
      expect(isGloby('!foo/*')).toBe(true)
      expect(isGloby('!foo/bar/**/*')).toBe(true)
    })
  })

  describe('falsy', () => {
    it('should not match escaped asterisks', () => {
      expect(isGloby('\\*')).toBe(false)
      expect(isGloby('\\*.js')).toBe(false)
      expect(isGloby('/\\*.js')).toBe(false)
    })

    it('should not match escaped globstar', () => {
      expect(isGloby('\\*\\*')).toBe(false)
      expect(isGloby('\\*\\*/a.js')).toBe(false)
    })

    it('should not match escaped question mark', () => {
      expect(isGloby('\\?')).toBe(false)
      expect(isGloby('\\?.js')).toBe(false)
      expect(isGloby('/\\?.js')).toBe(false)
    })

    it('should not match escaped braced sections', () => {
      expect(isGloby('\\{a,b}')).toBe(false)
      expect(isGloby('abc/\\{a,b}')).toBe(false)

      expect(isGloby('{a,b\\}')).toBe(false)
      expect(isGloby('abc/{a,b\\}')).toBe(false)
    })

    it('should not match escaped range wildcards', () => {
      expect(isGloby('\\[a-z]')).toBe(false)
      expect(isGloby('\\[a-z].js')).toBe(false)
      expect(isGloby('/\\[a-z]')).toBe(false)
      expect(isGloby('\\[!a-z]')).toBe(false)
      expect(isGloby('\\[^a-z]')).toBe(false)

      expect(isGloby('[a-z\\]')).toBe(false)
      expect(isGloby('[a-z\\].js')).toBe(false)
      expect(isGloby('/[a-z\\]')).toBe(false)
      expect(isGloby('[!a-z\\]')).toBe(false)
      expect(isGloby('[^a-z\\]')).toBe(false)
    })

    it('should not match escaped extended globs', () => {
      expect(isGloby('\\!(a|b|c)')).toBe(false)
      expect(isGloby('\\?(a|b|c)')).toBe(false)
      expect(isGloby('\\+(a|b|c)')).toBe(false)
      expect(isGloby('\\*(a|b|c)')).toBe(false)
      expect(isGloby('\\@(a|b|c)')).toBe(false)

      expect(isGloby('!\\(a|b|c)')).toBe(false)
      // expect(isGloby('?\\(a|b|c)')).toBe(false)
      expect(isGloby('+\\(a|b|c)')).toBe(false)
      // expect(isGloby('*\\(a|b|c)')).toBe(false)
      expect(isGloby('@\\(a|b|c)')).toBe(false)

      expect(isGloby('!(a|b|c\\)')).toBe(false)
      // expect(isGloby('?(a|b|c\\)')).toBe(false)
      expect(isGloby('+(a|b|c\\)')).toBe(false)
      // expect(isGloby('*(a|b|c\\)')).toBe(false)
      expect(isGloby('@(a|b|c\\)')).toBe(false)
    })

    it('should not match empty glob exclusion', () => {
      expect(isGloby('!')).toBe(false)
    })

    it('should not match escaped glob exclusion', () => {
      expect(isGloby('\\!')).toBe(false)
      expect(isGloby('\\!foo')).toBe(false)
      expect(isGloby('\\!foo/bar')).toBe(false)
    })

    it('should not match non-globs', () => {
      expect(isGloby('abc.js')).toBe(false)
      expect(isGloby('abc/def/ghi.js')).toBe(false)
      expect(isGloby('foo.js')).toBe(false)
      expect(isGloby('abc/@.js')).toBe(false)
      expect(isGloby('abc/+.js')).toBe(false)
      expect(isGloby()).toBe(false)
      expect(isGloby(null)).toBe(false)
    })
  })
})
