const rePreQuotes = /^['"]/
const rePostQuotes = /['"]$/
/**
 * Trim quotes of a given string.
 *
 * @param {string} str - A string.
 * @returns {string} - Returns `str`, but trimmed from quotes like `'`, `"`.
 */
const trimQuotes = str => str.replace(rePreQuotes, '').replace(rePostQuotes, '')

export default trimQuotes
