const reGlobFirstChar = /^\{.*[^\\]}|^\*\*?|^\[.*[^\\]]|^[!?+*@]\(.*[^\\]\)|^\?/
const reGlob = /(?!\\).(:?\{.*[^\\]}|\*\*?|\[.*[^\\]]|[!?+*@]\(.*[^\\]\)|\?)/

/**
 * Determines whether a provided string contains a glob pattern.
 *
 * @param {string} str - The string to test for glob patterns.
 * @returns {number} - Returns the index of the first glob pattern or `-1` if it is not a glob.
 */
const isGlob = (str) => {
  const match = reGlob.exec(str)
  let matchFirst
  let index = match ? match.index : -1

  if (!match || index === 0) {
    matchFirst = reGlobFirstChar.exec(str)

    if (matchFirst) {
      index = matchFirst.index
    }
  }

  if ((index > 0 || index === 0) && !matchFirst) {
    // eslint-disable-next-line no-plusplus
    ++index
  }

  return index
}

export default isGlob
