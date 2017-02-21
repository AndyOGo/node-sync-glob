import globBase from '../../src/lib/glob-base'

describe('lib/glob-base', () => {
  it('should resolve the base path of globs', () => {
    expect(globBase('*')).toEqual([''])
    expect(globBase('test/mock/*.txt')).toEqual(['test/mock'])
    expect(globBase('test/mock/a*txt')).toEqual(['test/mock'])

    expect(globBase('test/**/*.txt')).toEqual(['test'])

    expect(globBase('test/mock/?.txt')).toEqual(['test/mock'])
    expect(globBase('test/mock/a?txt')).toEqual(['test/mock'])

    expect(globBase('test/mock/{@org,foo}/.txt')).toEqual(['test/mock'])

    expect(globBase('test/[a-z]')).toEqual(['test'])
    expect(globBase('test/[!a-z]')).toEqual(['test'])
    expect(globBase('test/[^a-z]')).toEqual(['test'])

    expect(globBase('test/!(a|b|c)')).toEqual(['test'])
    expect(globBase('test/?(a|b|c)')).toEqual(['test'])
    expect(globBase('test/+(a|b|c)')).toEqual(['test'])
    expect(globBase('test/*(a|b|c)')).toEqual(['test'])
    expect(globBase('test/@(a|b|c)')).toEqual(['test'])
  })

  it('should resolve the base path of files', () => {
    expect(globBase('test/mock/a.txt')).toEqual(['test/mock'])
    expect(globBase('test/mock/@org/a.txt')).toEqual(['test/mock/@org'])
  })

  it('should leave directories unchanged', () => {
    expect(globBase('test/mock')).toEqual(['test/mock'])
    expect(globBase('test/mock/')).toEqual(['test/mock'])
    expect(globBase('test/mock/@org')).toEqual(['test/mock/@org'])
    expect(globBase('test/mock/@org/')).toEqual(['test/mock/@org'])
  })

  it('should ignore exclude patterns', () => {
    expect(globBase('!test/mock/*.txt')).toEqual([])
  })
})
