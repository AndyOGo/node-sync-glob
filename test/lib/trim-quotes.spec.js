import trimQuotes from '../../src/lib/trim-quotes'

describe('lib/trim-quotes', () => {
  it('should trim single quotes', () => {
    expect(trimQuotes("'foo'")).toBe('foo')
  })

  it('should trim double quotes', () => {
    expect(trimQuotes('"foo"')).toBe('foo')
  })

  it('should not remove quotes within text', () => {
    expect(trimQuotes('foo"bar')).toBe('foo"bar')
    expect(trimQuotes("foo'bar")).toBe("foo'bar")
  })
})
