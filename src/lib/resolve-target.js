import path from 'path'

const cwd = process.cwd()

const getBase = (source, bases) => bases.filter(base => source.indexOf(base) !== -1)
// eslint-disable-next-line no-confusing-arrow
  .reduce((hit, base) => hit.length > base.length ? hit : base, '')

const resolveTarget = bases => (source, target) => {
  const from = path.join(cwd, getBase(source, bases))

  return path.join(target, path.relative(from, source))
}

export default resolveTarget
