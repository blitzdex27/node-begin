# Node Begin

This is an auxiliary app. The project that aims to setup the Node development automatically. The following are the basic setup configurations that will be installed:

- nodemon
- eslint
- prettier
- babel
- webpack

# How to use

The 'devSrc' directory is the heart of this application.

- Create your own project directory
- Initialize npm
- Copy the 'devSrc' into the root of your project
- On your terminal run "node devSrc"

# Quickstart

For common users:

> node devSrc -a
> node devSrc -s

# Options

Running "node devSrc" will install default set of configurations. To install different configurations refer to the list below:

- Default: node devSrc
- All configs: node devSrc -a
- Custom: node devSrc -c configNames (e.g. node devSrc -c nodemon eslint)
- Uninstall: node devSrc -u
- Add scripts: node devSrc -s

Note that when webpack is installed, your index.js from ./src folder will have "require('regeneration-runtime)" declaration on top of your code. It will also install that that npm in your production dependencies. This is needed to make the webpack output file to run appropriately.

Also, when you chose to install all configs, your package.json scripts will be modified to a common scripts setup.

## Manual setup of configurations

# eslint

Install eslint dependency:

> npm install -D eslint
> npx eslint --init

Create a file named:

> .eslintrc.json

```javascript
{
"env": {
"browser": true,
"commonjs": true,
"es2021": true,
"node": true
},
"extends": [
"airbnb-base",
"prettier"
],
"plugins": [
"prettier"
],
"parserOptions": {
"ecmaVersion": 12
},
"rules": {}
}
```

# prettier

Install prettier dependencies to work with eslint:

> npm install -D prettier eslint-config-prettier eslint-plugin-prettier

From settings, choose ‘Prettier - Code formatter’ as default formatter.

Create a file in the root of your project directory named:

> .prettierrc

```javascript
{
  "printWidth": 100,
  "singleQuote": true
}
```

# babel

npm install -D @babel/core @babel/preset-env babel-loader @babel/node

Create a file in the root of your project directory named:

> .babelrc

```javascript
{
  "presets": ["@babel/presets-env"]
}
```

To start using babel

> babel-node ./src
> or
> nodemon --exec babel-node ./src

To also make it work with “jest”:

> npm install -D babel-jest @babel/polyfill
> Add a file on the root of src directory called “jest-setup.js”
> import "core-js/stable";
> import "regenerator-runtime/runtime";

From the “package.json” file add a property “jest”:

```javascript
"jest": {
"setupFiles": [
"./src/jest-setup.js"
]
}
```

# webpack

Install webpack dependencies

> npm install -D webpack webpack-cli webpack-node-externals

> npm install regeneration-runtime

Create a file in the root of your project directory named:

> webpack.config.js:

```javascript
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  mode: "production",
  externals: [nodeExternals()],
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
```

Modify thr package.json scripts:

```javascript
"build": "webpack"
```

On your JS files, add the following on top of your code:

```javascript
require("regeneration-runtime");
```

Done. Once you run the build script, the compressed file will be located on the "dist" directory, short for distribution.
