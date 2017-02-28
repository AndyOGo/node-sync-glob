import globBases from '../../src/lib/glob-bases'

describe('lib/glob-bases', () => {
  it('should resolve the base path of globs', () => {
    expect(globBases('*')).toEqual([''])
    expect(globBases('test/mock/*.txt')).toEqual(['test/mock'])
    expect(globBases('test/mock/a*txt')).toEqual(['test/mock'])

    expect(globBases('test/**/*.txt')).toEqual(['test'])

    expect(globBases('test/mock/?.txt')).toEqual(['test/mock'])
    expect(globBases('test/mock/a?txt')).toEqual(['test/mock'])

    expect(globBases('test/mock/{@org,foo}/.txt')).toEqual(['test/mock'])

    expect(globBases('test/[a-z]')).toEqual(['test'])
    expect(globBases('test/[!a-z]')).toEqual(['test'])
    expect(globBases('test/[^a-z]')).toEqual(['test'])

    expect(globBases('test/!(a|b|c)')).toEqual(['test'])
    expect(globBases('test/?(a|b|c)')).toEqual(['test'])
    expect(globBases('test/+(a|b|c)')).toEqual(['test'])
    expect(globBases('test/*(a|b|c)')).toEqual(['test'])
    expect(globBases('test/@(a|b|c)')).toEqual(['test'])
  })

  it('should resolve the base path of files', () => {
    expect(globBases('test/mock/a.txt')).toEqual(['test/mock'])
    expect(globBases('test/mock/@org/a.txt')).toEqual(['test/mock/@org'])
  })

  it('should leave directories unchanged', () => {
    expect(globBases('test/mock')).toEqual(['test/mock'])
    expect(globBases('test/mock/')).toEqual(['test/mock'])
    expect(globBases('test/mock/@org')).toEqual(['test/mock/@org'])
    expect(globBases('test/mock/@org/')).toEqual(['test/mock/@org'])
  })

  it('should ignore exclude patterns', () => {
    expect(globBases('!test/mock/*.txt')).toEqual([])
  })

  it('should list multiple distinct base paths', () => {
    expect(globBases([
      'test/mock/a.txt',
      'test/mock/bar/c.txt',
      'test/mock/@org',
      'test/mock/foo/*.txt',
    ])).toEqual([
      'test/mock',
      'test/mock/bar',
      'test/mock/@org',
      'test/mock/foo',
    ])
  })

  it('should list common base baths no more than once', () => {
    expect(globBases(['test/mock/a.txt', 'test/mock/b.txt'])).toEqual(['test/mock'])
    expect(globBases(['test/mock', 'test/mock/'])).toEqual(['test/mock'])
    expect(globBases(['test/*.txt', 'test/*.txt'])).toEqual(['test'])
  })
})
