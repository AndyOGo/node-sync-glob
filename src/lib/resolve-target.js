import path from 'path'

const cwd = process.cwd()

const getBase = (source, bases) => bases.filter(base => source.indexOf(base) !== -1)
// eslint-disable-next-line no-confusing-arrow
  .reduce((hit, base) => hit.length > base.length ? hit : base, '')

/**
 * Determines the target structure by resolving a given `source` against a list of base paths.
 *
 * @param {Array.<string>} bases - An array of base paths.
 * @returns {ResolveTargetFunc} - Returns an `source` to `target` resolving function.
 */
const resolveTarget = bases => (source, target) => {
  const from = path.join(cwd, getBase(source, bases))

  return path.join(target, path.relative(from, source))
}

export default resolveTarget

/**
 * A function which resolves a given `source` to a given `target` based on list of base paths.
 *
 * @typedef {function} ResolveTargetFunc
 * @param {string} source - A file or dir to be resolved against a list of base paths.
 * @param {string} target - A destination folder where to append the diff of `source` and `bases`.
 * @returns {string} - Returns an expanded `target`.
 */
