[![Coverage Status](https://coveralls.io/repos/github/raphamorim/blonde/badge.svg?branch=master)](https://coveralls.io/github/raphamorim/blonde?branch=master) [![Build Status](https://travis-ci.org/raphamorim/blonde.svg)](https://travis-ci.org/raphamorim/blonde) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

# Blonde

> painfull setup no more

## Summary

- [Why Blonde?](#why-blonde)
- [Getting](#getting)
- [Examples](#examples)
  - [Pure React](#pure-react)
  - [React with Flow and Apollo](#react-with-flow-and-apollo)
- [Usage](#usage)
  - [Bundling](#bundling-usage)
  - [Server Sider Render](#ssr-usage)
  - [Parsing to ReactElement](#parsing-to-reactelement)
  - [Resolving as Node Module](#resolving-as-node-module)
  - [Electron](#electron-usage)
- [How it works?](#how-it-works)
- [Who is using?](#whos-using)

#### Why Blonde?

You've probably already lost hours configuring Webpack by adding / removing babel plugins for each feature you want to control in a simple project. Blonde promises to meet all the basic needs of a React application by simply installing.

Blonde commits to deliver from the project bundle to the SSR layer. In addition to bringing SSR support for Electron. Everything is ready, with the promise of working from ES5 to the present.

Already behind ecosystem support for [flow](https://flow.org), object-rest-spread, class-properties ...

#### Getting

```bash
npm install -D blonde
```

# Examples

#### [Pure React](https://github.com/raphamorim/blonde/blob/master/test/fixtures/react/README.md)
#### [React with Flow and Apollo](https://github.com/raphamorim/blonde/blob/master/test/fixtures/react-flow-apollo/README.md)

# Usage

## toBundle

Not available yet, working in progress.

## toReactString

##### greeting.js

```js
import React from 'react'

class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>
  }
}

export default Greeting
```

##### apply it

```js
const blonde = require('blonde')
blonde.toReactString('./greeting.js')
```

##### output

```html
<h1 data-reactroot="" data-reactid="1" data-react-checksum="1601575969"><!-- react-text: 2 -->Hello, <!-- /react-text --></h1>
```

## toReactElement

```js
const blonde = require('blonde')
blonde.toReactElement('./greeting.js')
/*
{ '$$typeof': Symbol(react.element),
  type: [Function: Dialog],
  key: null,
  ref: null,
  props: {},
  _owner: null,
  _store: {} }
*/
```

## parse

```js
const blonde = require('blonde')
blonde.parse('./greeting.js')
/*
function Dialog(props) {
  (0, _helpers.log)('sample');

  return _react2.default.createElement(
    'section',
    { role: 'dialog', className: 'modal' },
    _react2.default.createElement('input', { type: 'text', className: 'modal-search', id: 'modal-search', placeholder: 'Search for packages....' }),
    _react2.default.createElement('div', { className: 'modal-items' }),
    _react2.default.createElement(_Tab2.default, null)
  );
}
*/
```

## toElectron

#### main.js

```js
const blonde = require('blonde')
const template = require('./template')

function createWindow() {
  let mainWindow = new BrowserWindow(config)
  let url = blonde.toElectron('src/App.js', template)

  mainWindow.loadURL(url)

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}
```

#### template.js

```js
module.exports = (app) => {
  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>My Template</title>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <div id="root">${app}</div>
      <script async src="bundle.js"></script>
    </body>
  </html>`
```

#### Can I use it for develop beyond Electron apps?

I strongly recommend: **NO**.

Why? Blonde reads any code and parse/transpile it in runtime. It cost a lot, just imagine for every process, you will read/parse/transpile/tokenize/write.

## How it works?

1. Read and transpile main component filepath, generating a node module
2. Every require in this node module is replaced by smart require (which transpile the source in runtime before nodejs parse start)
3. Parse'n deliver this module and repeat this it for every import/require missing.
4. Create a dynamic HTML file based on render result
5. When nodejs dispatch `exit`, `SIGINT` or `uncaughtException` event: delete `_.html`

If you're using, [let me know](https://github.com/raphamorim/blonde/issues/new) :)
