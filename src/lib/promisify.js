/**
 * Turn any async node first-error callback API into a Promise.
 * If `err` is truthy it will be rejected, else it will be resolved.
 *
 * @param {function} func - Any functions which accepts a last `done` callback with error-first style.
 * @param {Object} [options] - Optionally options as described below.
 * @param {any} [options.context=null] - Optionally bind `this` to some context.
 * @param {bool} [options.multiArgs] - Is `done` called with more than `err` and `result` arguments.
 * @returns {PromiseFactory} - Returns a function which returns a Promise.
 */
const promisify = (func, { context = null, multiArgs } = {}) => (...args) => new Promise((resolve, reject) => {
  args.push((err, ...values) => {
    // console.log(values)
    if (err) reject(err)
    else resolve(multiArgs ? values : values[0])
  })

  func.apply(context, args)
})

export default promisify

/**
 * A factory function which takes a variadic length of arguments, calls `func` with it and returns a Promise.
 *
 * @typedef {function} PromiseFactory
 * @param {...any} [args] - Any arguments accepted by the supplied `func`'s API.
 */

