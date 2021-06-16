const fs = require('fs');
const path = require('path');
const cp = require('child_process');

module.exports = (action) =>
  new Promise((resolve, reject) => {
    const prereqInst = cp.spawn('npm.cmd', [action, 'regenerator-runtime']);

    const index = fs.readFileSync(
      path.resolve(__dirname, '..', '..', 'src', 'index.js'),
      'UTF-8'
    );
    const regenerator1 = "require('regenerator-runtime')";
    const regenerator2 = 'require("regenerator-runtime")';
    const regenerator3 = '\nrequire("regenerator-runtime")';
    const regenerator4 = '\\nrequire("regenerator-runtime")';
    const regVersions = [
      regenerator1,
      regenerator2,
      regenerator3,
      regenerator4,
    ];

    let newIndex;
    let splitIndex = index.split(';');

    const hasRegeneratorDefined =
      splitIndex.includes(regenerator1) ||
      splitIndex.includes(regenerator2) ||
      splitIndex.includes(regenerator3) ||
      splitIndex.includes(regenerator4);

    // console.log('regenerator1', regenerator1);
    // console.log('regenerator2', regenerator2);
    // console.log('regenerator3', regenerator3);
    // console.log('regenerator4', regenerator4);
    // console.log('hasRegDef', hasRegeneratorDefined)
    // console.log('splitIndex', splitIndex);

    if (action === 'install') {
      if (!hasRegeneratorDefined) {
        newIndex = `${regenerator1}; ${index}`;
      } else {
        newIndex = index;
      }
    }
    if (action === 'uninstall') {
      if (hasRegeneratorDefined) {
        splitIndex = splitIndex.filter((s) => {
          if (!regVersions.includes(s)) return true;
          return false;
        });

        // dSplitIndex.forEach((item, i) => {
        //   console.log(item);
        //   console.log(regVersions.includes(item));
        //   if (regVersions.includes(item)) {
        //     splitIndex.splice(i, 1);
        //   }
        //   console.log(splitIndex);
        // });
      }
      newIndex = splitIndex.join(';');
    }

    fs.writeFileSync(
      path.resolve(__dirname, '..', '..', 'src', 'index.js'),
      newIndex
    );

    prereqInst.on('close', () => {
      const applyPrettier = cp.spawn('npx.cmd', [
        'prettier',
        '--single-quote',
        '--write',
        'src',
      ]);
      applyPrettier.on('close', () => {
        resolve();
      });
    });
  });
