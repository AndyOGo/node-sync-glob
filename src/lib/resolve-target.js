import path from 'path'

const cwd = process.cwd()

const getBase = (file, bases) => bases.filter(base => file.indexOf(base) !== -1)
// eslint-disable-next-line no-confusing-arrow
  .reduce((hit, base) => hit.length > base.length ? hit : base, '')

const resolveTarget = bases => (file, target) => {
  const from = path.join(cwd, getBase(file, bases))

  return path.join(target, path.relative(from, file))
}

export default resolveTarget
