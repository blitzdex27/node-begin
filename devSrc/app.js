/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const install = require('./install');

const devConfigs = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'configs', 'dev.config.json'))
);

module.exports = async (installOpt) => {
  const optN = installOpt.name;

  const settings = {
    configs,
    uninstall: false,
    all: false,
  };

  // The option "all" install all configs from devConfigs
  if (optN === 'default') {
    const defaultConfigs = ['eslint', 'prettier'];
    settings.configs = devConfigs.filter((config) =>
      defaultConfigs.includes(config.name)
    );
  } else if (optN === 'custom') {
    settings.configs = devConfigs.filter((config) =>
      installOpt.devDep.includes(config.name)
    );
  } else if (optN === 'all') {
    settings.all = true;
  } else if (optN === 'uninstall') {
    settings.uninstall = true;
  } else {
    process.stdout.write('Error: Invalid option');
    process.exit();
  }

  const { configs, uninstall, all } = settings;
  const results = [];
  for (let i = 0; i < devConfigs.length; i += 1) {
    const config = configs[i];

    process.stdout.write(`Installing ${config.name}...`);
    const result = await install(settings.devConfigs[i], uninstall);
    results.push(result);
  }

  process.stdout.write(results);
};
