const fs = require('fs')
const url = require('url')

const assert = require('assert')
const reactfy = require('../index')

process.env['REACTFY_DEBUG'] = true
process.env['DEBUG'] = true

describe('React Flow Apollo App Render', function () {
  context('Setting Template', function () {
    it('should get app rendered wrapped by template', function (done) {
      const result = reactfy({
        path: 'test/fixtures/react-flow-apollo/main.js',
        resolve: 'string'
      })

      const renderedApp = '<div data-reactroot="" data-reactid="1" data-react-checksum="-36490836"><img src="http//image.jpg" class="wrapper  visible" data-reactid="2"/><h2 data-reactid="3">My Image</h2></div>'

      assert.equal(typeof result, 'string')
      assert.equal(result, renderedApp)

      done()
    })
  })
  context('Without set template', function () {
    it('should get app rendered only', function (done) {
      const result = reactfy({
        path: 'test/fixtures/react-flow-apollo/main.js',
        resolve: 'module'
      })

      assert.equal(typeof result, 'function')
      // assert.equal(result, renderedApp)

      done()
    })
  })
  context('Without set template', function () {
    it('should get app rendered only', function (done) {
      const result = reactfy({
        path: 'test/fixtures/react-flow-apollo/main.js',
        resolve: 'react'
      })

      assert.equal(typeof result, 'object')

      done()
    })
  })
  // context('Check if create tmp file', function () {
  //   it('should have tmp file', function (done) {
  //     const result = reactfy({
  //       path: 'test/fixtures/react/main.js',
  //       template: template
  //     })

  //     assert.equal(typeof result, 'string')
  //     assert.equal(result, url.format({
  //       pathname: `${process.cwd()}/reactfy.html`,
  //       protocol: 'file:',
  //       slashes: true
  //     }))
  //     assert.equal(fs.readFileSync('./reactfy.html').toString(), template(renderedApp))

  //     done()
  //   })
  // })
})
