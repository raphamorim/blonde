const reactfy = require('./index')

process.env['REACTFY_DEBUG'] = true
process.env['DEBUG'] = true

console.log(reactfy({
  path: 'test/fixtures/react-flow-apollo/main.js',
  resolve: 'string'
}))
