const reactfy = require('reactfy')

console.log('SSR: ', reactfy({
  path: './main.js',
  resolve: 'string'
}))

console.log('ReactElement: ', reactfy({
  path: './main.js',
  resolve: 'react'
}))
