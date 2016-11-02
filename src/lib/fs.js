import fs from 'fs-extra'

export const copy = (source, target, notify) => {
  notify('copy', [source, target])

  try {
    fs.copySync(source, target)
    return true
  } catch (e) {
    notify('error', e)
    return false
  }
}

export const destroy = (fileordir, notify) => {
  notify('remove', fileordir)
  try {
    fs.remove(fileordir)
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
