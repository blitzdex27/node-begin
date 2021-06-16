const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const cp = require('child_process');
const webpackPrereq = require('./configs/webpackPrereq');

module.exports = async (config, uninstall = false) =>
  new Promise((resolve, reject) => {
    const t0 = performance.now();
    const { name, configFile } = config;

    const filePath = path.resolve(__dirname, 'configs', configFile);
    const destPath = path.resolve(__dirname, '..', configFile);

    let action;
    if (!uninstall) {
      fs.copyFileSync(filePath, destPath);
      action = 'install';
    } else {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      action = 'uninstall';
    }

    const installation = cp.spawn('npm.cmd', [
      '-D',
      action,
      ...config.dependencies,
    ]);

    installation.on('close', () => {
      if (name === 'webpack') {
        webpackPrereq(action).then(() => {
          const t1 = performance.now();
          resolve({
            name,
            timeElapsed: `${((t1 - t0) / 1000).toFixed(2)} seconds`,
          });
        });
      } else {
        const t1 = performance.now();
        resolve({
          name,
          timeElapsed: `${((t1 - t0) / 1000).toFixed(2)} seconds`,
        });
      }
    });
    installation.on('error', (err) => {
      process.stdout.write(
        `Error occured!\n\tOrigin: ${name} installation\n\tError message:${err}`
      );
      reject();
    });
  });
