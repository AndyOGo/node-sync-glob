import fs from 'fs-extra'
import path from 'path'

const cwd = process.cwd()

export const copy = (source, target, options, notify) => {
  try {
    const sourceStat = fs.statSync(source)

    if (sourceStat.isFile()) {
      if (options.transform) {
        const transform = options.transform
        const file = fs.readFileSync(source)
        const transformed = transform(file, target)
        const isObject = typeof transformed === 'object'
        const data = (isObject && transformed.data) || transformed
        const newTarget = (isObject && transformed.target) || target

        fs.mkdirsSync(path.dirname(newTarget))
        fs.writeFileSync(newTarget, data)

        notify('copied', [source, newTarget])
      } else {
        fs.copySync(source, target)

        notify('copied', [source, target])
      }
    } else if (sourceStat.isDirectory()) {
      fs.ensureDirSync(target)

      notify('copied', [source, target])
    }
    return true
  } catch (e) {
    notify('error', e)
    return false
  }
}

export const destroy = (fileordir, notify) => {
  try {
    fs.removeSync(fileordir)
    notify('removed', fileordir)
    return true
  } catch (e) {
    notify('error', e)
    return false
  }
}

export const deleteExtra = (fileordir, options, notify) => {
  if (options.delete) {
    return destroy(fileordir, notify)
  } else {
    notify('no-delete', fileordir)
    return true
  }
}

const getBase = (file, bases) => bases.filter(base => file.indexOf(base) !== -1)
  // eslint-disable-next-line no-confusing-arrow
  .reduce((hit, base) => hit.length > base.length ? hit : base, '')

export const resolveTarget = (file, target, options) => {
  const from = path.join(cwd, getBase(file, options.base))

  return path.join(target, path.relative(from, file))
}
