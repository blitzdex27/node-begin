const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');
const cp = require('child_process');

module.exports = async (config, uninstall = false) =>
  new Promise((resolve, reject) => {
    const t0 = performance.now();
    const { name, filename } = config;

    const filePath = path.resolve(__dirname, 'configs', filename);

    const action = uninstall ? 'uninstall' : 'install';

    const installation = cp.spawn('npm.cmd', [
      '-D',
      action,
      ...config.dependencies,
    ]);

    installation.on('close', () => {
      const t1 = performance.now();
      resolve({
        name,
        timeElapsed: t1 - t0,
      });
    });
    installation.on('error', (err) => {
      process.stdout.write(
        `Error occured!\n\tOrigin: ${name} installation\n\tError message:${err}`
      );
      reject();
    });
  });
