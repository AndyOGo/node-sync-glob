const promisify = (func, { context = null, multiArgs }) => (...args) => new Promise((resolve, reject) => {
  args.push((err, ...values) => {
    if (err) reject(err)
    else resolve(multiArgs ? values : values[0])
  })

  func.apply(context, args)
})

export default promisify

