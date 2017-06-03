const fs = require('fs')
const url = require('url')

const assert = require('assert')
const blonde = require('../index')

process.env['BLONDE_DEBUG'] = true
process.env['DEBUG'] = true

describe('React Flow Apollo App Render', function () {
  context('Setting Template', function () {
    it('should get app rendered wrapped by template', function (done) {
      const path = 'test/fixtures/react-flow-apollo/main.js'
      const result = blonde.toReactString(path)

      const renderedApp = '<div data-reactroot="" data-reactid="1" data-react-checksum="-36490836"><img src="http//image.jpg" class="wrapper  visible" data-reactid="2"/><h2 data-reactid="3">My Image</h2></div>'

      assert.equal(typeof result, 'string')
      assert.equal(result, renderedApp)

      done()
    })
  })
  context('Without set template', function () {
    it('should get app rendered only', function (done) {
      const path = 'test/fixtures/react-flow-apollo/main.js'
      const result = blonde.parse(path)

      assert.equal(typeof result, 'function')
      // assert.equal(result, renderedApp)

      done()
    })
  })
  context('Without set template', function () {
    it('should get app rendered only', function (done) {
      const path = 'test/fixtures/react-flow-apollo/main.js'
      const result = blonde.toReactElement(path)

      assert.equal(typeof result, 'object')

      done()
    })
  })
})
