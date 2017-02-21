/* eslint-disable */
module.exports = function transform(data, target) {
  console.log('transform %s', target)

  data += '\n\nTransformed file'
  target = target.replace(/b\.txt$/, 'b-replaced.txt')

  return {
    data: data,
    target: target,
  }
}
