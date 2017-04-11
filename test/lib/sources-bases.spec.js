import { sep } from 'path'
import sourcesBases from '../../src/lib/sources-bases'

describe('lib/sources-bases', () => {
  it('should resolve the base path of globs', () => {
    expect(sourcesBases('*')).toEqual([''])
    expect(sourcesBases('test/mock/*.txt')).toEqual([`test${sep}mock`])
    expect(sourcesBases('test/mock/a*txt')).toEqual([`test${sep}mock`])

    expect(sourcesBases('test/**/*.txt')).toEqual(['test'])

    expect(sourcesBases('test/mock/?.txt')).toEqual([`test${sep}mock`])
    expect(sourcesBases('test/mock/a?txt')).toEqual([`test${sep}mock`])

    expect(sourcesBases('test/mock/{@org,foo}/.txt')).toEqual([`test${sep}mock`])

    expect(sourcesBases('test/[a-z]')).toEqual(['test'])
    expect(sourcesBases('test/[!a-z]')).toEqual(['test'])
    expect(sourcesBases('test/[^a-z]')).toEqual(['test'])

    expect(sourcesBases('test/!(a|b|c)')).toEqual(['test'])
    expect(sourcesBases('test/?(a|b|c)')).toEqual(['test'])
    expect(sourcesBases('test/+(a|b|c)')).toEqual(['test'])
    expect(sourcesBases('test/*(a|b|c)')).toEqual(['test'])
    expect(sourcesBases('test/@(a|b|c)')).toEqual(['test'])
  })

  it('should resolve the base path of files', () => {
    expect(sourcesBases('test/mock/a.txt')).toEqual([`test${sep}mock`])
    expect(sourcesBases('test/mock/@org/a.txt')).toEqual([`test${sep}mock${sep}@org`])
  })

  it('should leave directories unchanged', () => {
    expect(sourcesBases('test/mock')).toEqual([`test${sep}mock`])
    expect(sourcesBases('test/mock/')).toEqual([`test${sep}mock`])
    expect(sourcesBases('test/mock/@org')).toEqual([`test${sep}mock${sep}@org`])
    expect(sourcesBases('test/mock/@org/')).toEqual([`test${sep}mock${sep}@org`])
  })

  it('should ignore exclude patterns', () => {
    expect(sourcesBases('!test/mock/*.txt')).toEqual([])
  })

  it('should list multiple distinct base paths', () => {
    expect(sourcesBases([
      'test/mock/a.txt',
      'test/mock/bar/c.txt',
      'test/mock/@org',
      'test/mock/foo/*.txt',
    ])).toEqual([
      `test${sep}mock`,
      `test${sep}mock${sep}bar`,
      `test${sep}mock${sep}@org`,
      `test${sep}mock${sep}foo`,
    ])
  })

  it('should list common base baths no more than once', () => {
    expect(sourcesBases(['test/mock/a.txt', 'test/mock/b.txt'])).toEqual([`test${sep}mock`])
    expect(sourcesBases(['test/mock', 'test/mock/'])).toEqual([`test${sep}mock`])
    expect(sourcesBases(['test/*.txt', 'test/*.txt'])).toEqual(['test'])
  })
})
