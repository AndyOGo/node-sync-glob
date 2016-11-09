import fs from 'fs-extra'
import path from 'path'

const cwd = process.cwd()

export const copy = (source, target, options, notify) => {
  notify('copy', [source, target])

  try {
    const sourceStat = fs.statSync(source)

    if (sourceStat.isFile()) {
      if (options.transform) {
        const transform = options.transform
        const file = fs.readFileSync(source)
        const transformed = transform(file, target)

        fs.writeFileSync(transformed.target || target, transformed.data || transformed)
      } else {
        fs.copySync(source, target)
      }
    } else if (sourceStat.isDirectory()) {
      fs.ensureDirSync(target)
    }
    return true
  } catch (e) {
    notify('error', e)
    return false
  }
}

export const destroy = (fileordir, notify) => {
  notify('remove', fileordir)
  try {
    fs.removeSync(fileordir)
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

const getBase = (file, base) => base.filter((base) => file.indexOf(base) !== -1)
    .reduce((hit, base) => hit.length > base.length ? hit : base, '')

export const resolveTarget = (file, target, options) => {
  const from = path.join(cwd, getBase(file, options.base))

  return path.join(target, path.relative(from, file))
}
