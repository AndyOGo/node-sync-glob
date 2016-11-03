const rePreQuotes = /^['"]/
const rePostQuotes = /['"]$/
const trimQuotes = str => str.replace(rePreQuotes, '').replace(rePostQuotes, '')

export default trimQuotes
