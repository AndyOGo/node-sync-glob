import path from 'path'

import resolveTarget from '../../src/lib/resolve-target'

describe('lib/resolve-target', () => {
  it('should resolve targets', () => {
    const bases = [
      'test',
      'test/mock',
      'test/mock/foo',
      'test/mock/bar',
      'test/mock/@org',
    ]
    const resolveTargetFromBases = resolveTarget(bases)
    const target = 'dist'

    expect(resolveTargetFromBases('test/a.txt', target)).toEqual(path.normalize('dist/a.txt'))
    expect(resolveTargetFromBases('test/lib/a.txt', target)).toEqual(path.normalize('dist/lib/a.txt'))
    expect(resolveTargetFromBases('test/mock/a.txt', target)).toEqual(path.normalize('dist/a.txt'))
    expect(resolveTargetFromBases('test/mock/lib/a.txt', target)).toEqual(path.normalize('dist/lib/a.txt'))
    expect(resolveTargetFromBases('test/mock/foo/a.txt', target)).toEqual(path.normalize('dist/a.txt'))
    expect(resolveTargetFromBases('test/mock/foo/lib/a.txt', target)).toEqual(path.normalize('dist/lib/a.txt'))
    expect(resolveTargetFromBases('test/mock/bar/a.txt', target)).toEqual(path.normalize('dist/a.txt'))
    expect(resolveTargetFromBases('test/mock/bar/lib/a.txt', target)).toEqual(path.normalize('dist/lib/a.txt'))
    expect(resolveTargetFromBases('test/mock/@org/a.txt', target)).toEqual(path.normalize('dist/a.txt'))
    expect(resolveTargetFromBases('test/mock/@org/lib/a.txt', target)).toEqual(path.normalize('dist/lib/a.txt'))
  })
})
