[![Coverage Status](https://coveralls.io/repos/github/raphamorim/reactfy/badge.svg?branch=master)](https://coveralls.io/github/raphamorim/reactfy?branch=master) [![Build Status](https://travis-ci.org/raphamorim/reactfy.svg)](https://travis-ci.org/raphamorim/reactfy) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)

# Reactfy [STILL IN EXPERIMENTAL PHASE]

![Reactfy](images/illustration.jpg)

> No more painfull React's setup

## Summary

- [Why Reactfy?](#why-reactfy)
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

#### Why Reactfy?

You've probably already lost hours configuring Webpack by adding / removing babel plugins for each feature you want to control in a simple project. Reactfy promises to meet all the basic needs of a React application by simply installing.

Reactfy commits to deliver from the project bundle to the SSR layer. In addition to bringing SSR support for Electron. Everything is ready, with the promise of working from ES5 to the present.

Already behind ecosystem support for [flow](https://flow.org), object-rest-spread, class-properties ...

#### Getting

```bash
npm install -D reactfy
```

# Examples

#### [Pure React](test/fixtures/react/README.md)
#### [React with Flow and Apollo](test/fixtures/react-flow-apollo/README.md)

# Usage

## Bundling

Not available yet, working in progress.

## SSR usage

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
const reactfy = require('reactfy')
console.log(reactfy({path: './greeting.js', resolve: 'string'}))
```

##### output

```html
<h1 data-reactroot="" data-reactid="1" data-react-checksum="1601575969"><!-- react-text: 2 -->Hello, <!-- /react-text --></h1>
```

## Parsing to ReactElement

```js
const reactfy = require('reactfy')
console.log(reactfy({path: './greeting.js', resolve: 'react'}))
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

## Resolving as Node Module

```js
const reactfy = require('reactfy')
console.log(reactfy({path: './greeting.js', resolve: 'module'}))
/*

*/
```

## Electron Usage

#### main.js

```js
const reactfy = require('reactfy')
const template = require('./template')

function createWindow() {
  let mainWindow = new BrowserWindow(config)

  mainWindow.loadURL(reactfy({
    path: 'src/App.js',
    template: template
  }))

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

Why? Reactfy reads any code and parse/transpile it in runtime. It cost a lot, just imagine for every process, you will read/parse/transpile/tokenize/write.

## How it works?

1. Read and transpile main component filepath, generating a node module
2. Every require in this node module is replaced by smart require (which transpile the source in runtime before nodejs parse start)
3. Parse'n deliver this module and repeat this it for every import/require missing.
4. Create a dynamic HTML file based on render result
5. When nodejs dispatch `exit`, `SIGINT` or `uncaughtException` event: delete `_.html`

## Who's using:

- [Retro Editor](https://github.com/raphamorim/retro)

If you're using, [let me know](https://github.com/raphamorim/reactfy/issues/new) :)
