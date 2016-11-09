const reGlobFirstChar = /^\{.*}|\*\*?|\[.*]|[!?+*@]\(.*\)|\?/
const reGlob = /(?!\\).(:?\{.*}|\*\*?|\[.*]|[!?+*@]\(.*\)|\?)/

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

  if (index > 0 || index === 0 && !matchFirst) {
    ++index
  }

  return index
}

export default isGlob
