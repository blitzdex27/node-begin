const fs = require("fs");
const path = require("path");
const app = require("./app");
const addScripts = require("./addScripts");

let installOpt = process.argv[2];

const availableDep = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "configs", "dev.config.json"))
);
const depNames = availableDep.map((dep) => dep.name);

if (!installOpt) {
  installOpt = { name: "default" };
} else if (installOpt === "-a") {
  installOpt = { name: "all" };
} else if (installOpt === "-u") {
  installOpt = { name: "uninstall" };
} else if (installOpt === "-c") {
  installOpt = { name: "custom" };
  const devDep = process.argv.filter((arg, index) => {
    if (![0, 1, 2].includes(index)) {
      if (depNames.includes(arg)) return true;
    }
    return false;
  });

  // If no custom dependencies are specified
  if (devDep.length === 0) {
    process.stdout.write("Custom dependencies are not specified\n");
    process.stdout.write("Exiting...");
    process.exit();
  }

  installOpt.devDep = devDep;
}

if (installOpt === "-s") {
  addScripts();
} else {
  app(installOpt);
}
