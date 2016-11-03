const reGlob = /(?!\\).(:?\{.*}|\*\*?|\[|[!?+*@]\(.*\)|\?)/

const isGlob = (str) => {
  const match = reGlob.exec(str)

  return match ? match.index : -1
}

export default isGlob
