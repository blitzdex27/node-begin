const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath));

const newScripts = {
  build: 'webpack',
  postinstall: 'npm run build',
  pretest: 'cowsay "running tests don\'t panic"',
  test: 'jest --coverage',
  prestart: 'npm run build',
  start: 'node ./dist/main.js',
  'dev:start': 'cls && nodemon --exec babel-node ./src',
  'dev:coverage': '',
  'dev:test': 'jest --watchAll',
};
packageJson.scripts = newScripts;

module.exports = () => {
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
};
