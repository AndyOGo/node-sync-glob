import globBases from '../../src/lib/glob-bases'

describe('lib/glob-base', () => {
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
})
