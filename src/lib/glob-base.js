const reStaticGlob = /^(?:\\[+*?@{}[\]()]|[^+*?@{}[\]()])+/

const globBase = (glob) => {
  if (!Array.isArray(glob)) {
    glob = [glob]
  }

  return glob.reduce((base, pattern) => {
    if (pattern.charAt(0) === '!') {
      return base
    }

    const match = pattern.match(reStaticGlob)

    if (match) {
      base.push(match[0])
    }

    return base
  }, [])
}

export default globBase
