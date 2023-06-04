import { paths, expand } from "@dotenv-run/core";
import * as chalk from "chalk";
import * as spawn from "cross-spawn";
import * as minimist from "minimist";

const argv = minimist(process.argv.slice(2));
const root = argv.e || process.cwd();
const verbose = argv.v ?? false;

const envPaths = paths(process.env.NODE_ENV, root);

if (verbose) {
  envPaths.forEach((envPath) => {
    console.log(`${chalk.green(" ✔")} ${envPath}`);
  });
}

expand(envPaths);

const command = argv._[0];
if (command) {
  spawn(command, argv._.slice(1), { stdio: "inherit" }).on(
    "exit",
    function (exitCode, signal) {
      if (typeof exitCode === "number") {
        process.exit(exitCode);
      } else {
        process.kill(process.pid, signal);
      }
    }
  );
}
