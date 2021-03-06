'use strict'

const fs = require('fs')
const nodePath = require('path')
const url = require('url')
const babel = require('babel-core')
const react = require('react')
const isDirectory = require('is-directory')
const requireFromString = require('require-from-string')
const reactDOMServer = require('react-dom/server')
const tryRequire = require('try-require')

const babelConfig = {
  presets: [require('babel-preset-react'), require('babel-preset-flow'), 'es2015'],
  ignore: /node_modules/,
  plugins: [
    // used to comply to babel-preset-react-app
    require('babel-plugin-transform-class-properties'),
    // used to comply to babel-preset-react-app
    require('babel-plugin-transform-object-rest-spread'),
    // used to remove css imports
    [
      require('babel-plugin-transform-require-ignore').default,
      {
        extensions: ['.css', '.scss', '.less']
      }
    ]
  ]
}

let DIRPATH, lastFilePath

function parse (path) {
  return Blonde({
    path: path,
    resolve: 'module'
  })
}

function toString (path) {
  return Blonde({
    path: path,
    resolve: 'string'
  })
}

function toReactString (path, template) {
  return Blonde({
    path: path,
    resolve: 'react-string',
    template: template
  })
}

function toReactElement (path) {
  return Blonde({
    path: path,
    resolve: 'react'
  })
}

function toElectron (path, template) {
  return Blonde({
    path: path,
    template: template
  })
}

function extend (a, b, undefOnly) {
  for (var prop in b) {
    if (Object.prototype.hasOwnProperty.call(b, prop)) {
      if (prop !== 'constructor' || a !== global) {
        if (b[prop] === undefined) {
          delete a[prop]
        } else if (!(undefOnly && typeof a[prop] !== 'undefined')) {
          a[prop] = b[prop]
        }
      }
    }
  }
  return a
}

const logger = function _logger (message, important) {
  if (process.env.DEBUG) {
    if (important) {
      return console.log('\x1b[36m%s\x1b[0m', message)
    }

    console.log(message)
  }
}

function Blonde (config) {
  if (!config.path) {
    return false
  }

  const componentPath = config.path
  const template = config.template || ((app) => app)
  const resolve = config.resolve || false

  function deleteFile (filepath) {
    try {
      fs.unlinkSync(filepath)
    } catch (e) {
      logger(e)
    }
  }

  logger(`${componentPath}`, true)

  const componentAbsolutePath = `${process.cwd()}/${componentPath}`
  DIRPATH = componentAbsolutePath.replace(/\/[^\/]+$/, '') // eslint-disable-line

  logger(DIRPATH, true)

  let transform = babel.transformFileSync(componentAbsolutePath, babelConfig)

  transform = transform.code.replace('exports.default', 'module.exports')

  const pathBlonde = (process.env.BLONDE_DEBUG) ? `${process.cwd()}/index.js` : 'blonde'
  transform = `"use strict"; require = require('${pathBlonde}').load; ${transform}`

  try {
    lastFilePath = null

    const app = requireFromString(transform)
    if (resolve && resolve === 'string') {
      return app.toString()
    }

    if (resolve && resolve === 'module') {
      return app
    }

    const App = react.createElement(app)
    if (resolve && resolve === 'react') {
      return App
    }

    const appString = reactDOMServer.renderToString(App)
    const body = template(appString)
    if (resolve && resolve === 'react-string') {
      return body
    }

    const indexPath = `${process.cwd()}/blonde.html`
    fs.writeFileSync(indexPath, body, 'utf-8')

    // do something when app is closing
    process.on('exit', deleteFile.bind(this, indexPath))
    // catches ctrl+c event
    process.on('SIGINT', deleteFile.bind(this, indexPath))
    // catches uncaught exceptions
    process.on('uncaughtException', deleteFile.bind(this, indexPath))

    return url.format({
      pathname: indexPath,
      protocol: 'file:',
      slashes: true
    })
  } catch (err) {
    logger(err)
    return err
  }
}

// transfom nodejs-require to require('blonde').load;
function load (path) {
  try {
    let dep
    logger(`recursive last path: ${lastFilePath}`)

    logger(`trying... >>>${path}`, true)
    dep = tryRequire(path)
    if (dep !== undefined) {
      return dep
    }

    logger(`trying... ${DIRPATH}/node_modules/${path}`, true)
    dep = tryRequire(`${DIRPATH}/node_modules/${path}`)
    if (dep !== undefined) {
      return dep
    }

    if (lastFilePath) {
      const withLastPath = nodePath.dirname(lastFilePath)
      logger(`trying... ${withLastPath}/${path}`, true)
      dep = tryRequire.resolve(`${withLastPath}/${path}`)
      if (dep !== undefined) {
        path = `${withLastPath}/${path}`
        // TODO: Solve recursive levels
        lastFilePath = path
      } else {
        lastFilePath = null
        path = path.replace('./', '')
        path = `${DIRPATH}/${path}`
      }
    } else {
      path = path.replace('./', '')
      path = `${DIRPATH}/${path}`
    }

    if (isDirectory.sync(path)) {
      path = path + '/index.js'
    } else {
      path = path + '.js'
    }

    logger(path, true)

    let transform = babel.transformFileSync(path, babelConfig)
    lastFilePath = path

    transform = transform.code.replace('exports.default', 'module.exports')
    const pathBlonde = (process.env.BLONDE_DEBUG) ? `${process.cwd()}/index.js` : 'blonde'
    transform = `"use strict"; require = require('${pathBlonde}').load; ${transform}`
    return requireFromString(transform)
  } catch (err) {
    logger(err)
    return err
  }
}

module.exports = extend(Blonde.bind(this), {
  load: load,
  parse: parse,
  toString: toString,
  toReactString: toReactString,
  toReactElement: toReactElement,
  toElectron: toElectron,
})
