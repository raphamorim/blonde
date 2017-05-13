const reactfy = require('reactfy')

console.log(reactfy({
  path: './main.js',
  resolve: 'string'
}))

console.log(reactfy({
  path: './main.js',
  resolve: 'react'
}))
