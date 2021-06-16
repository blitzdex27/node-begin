/* eslint-disable no-await-in-loop */
const fs = require("fs");
const path = require("path");
const install = require("./install");

const devConfigs = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "configs", "dev.config.json"))
);

module.exports = async (installOpt) => {
  const optN = installOpt.name;

  const settings = {
    configs: devConfigs,
    uninstall: false,
    all: false,
  };

  // The option "all" install all configs from devConfigs
  if (optN === "default") {
    const defaultConfigs = ["eslint", "prettier"];
    settings.configs = devConfigs.filter((config) =>
      defaultConfigs.includes(config.name)
    );
  } else if (optN === "custom") {
    settings.configs = devConfigs.filter((config) =>
      installOpt.devDep.includes(config.name)
    );
  } else if (optN === "all") {
    settings.all = true;
  } else if (optN === "uninstall") {
    settings.uninstall = true;
  } else {
    process.stdout.write("Error: Invalid option");
    process.exit();
  }

  const { configs, uninstall } = settings;
  const action = !uninstall ? "Install" : "Uninstall";
  const results = [];

  for (let i = 0; i < configs.length; i += 1) {
    const config = configs[i];

    // eslint-disable-next-line no-console
    console.clear();
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(
      `${action}ation progress: ${
        (i / configs.length) * 100
      }% || ${action}ing ${config.name}...`
    );
    const result = await install(config, uninstall);
    results.push(result);

    if (i === configs.length - 1) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${action} progress: $100% || DONE!\n`);
    }
  }

  //   console.log(results);
  process.stdout.write(`\n${action}ation results:\n`);
  process.stdout.write(`+--------------+----------------+\n`);
  process.stdout.write(`| Package Name | Time Elapsed   |\n`);
  process.stdout.write(`+--------------+----------------+\n`);
  results.forEach((result) => {
    process.stdout.write(`| ${result.name}`);
    process.stdout.cursorTo(15);
    process.stdout.write(`|`);
    process.stdout.cursorTo(17);
    process.stdout.write(`${result.timeElapsed}`);
    process.stdout.cursorTo(32);
    process.stdout.write(`|\n`);
  });
  process.stdout.write(`+--------------+----------------+\n`);
};
