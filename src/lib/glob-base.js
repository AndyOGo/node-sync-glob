const reGlob = /(?!\\).(:?{|\*|\?|\[|[!?+*@]\()/

const globBase = (glob) => {
  if (!Array.isArray(glob)) {
    glob = [glob]
  }

  return glob.reduce((base, pattern) => {
    if (pattern.charAt(0) === '!') {
      return base
    }

    const length = pattern.length
    const match = reGlob.exec(pattern)
    const index = match ? match.index : length

    if (index > 0) {
      base.push(pattern.substring(0, index))
    }

    return base
  }, [])
}

export default globBase
