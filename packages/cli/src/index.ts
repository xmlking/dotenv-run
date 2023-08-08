#!/usr/bin/env node
import { rootExpand } from "@dotenv-run/core";
import * as chalk from "chalk";
import * as minimist from "minimist";
import { run } from "./run";

const argv = minimist(process.argv.slice(2), {
  string: ["root", "env"],
  boolean: ["silent"],
  alias: { help: "h", silent: "s", root: "r", env: "e" },
});

function help() {
  console.log(`
  Usage: dotenv-run [options] -- <command>
  
  Options:
  
    -h, --help     output usage information
    -e, --env      output usage information
    -s, --silent   do not print .env file paths
    -r, --root     root directory to search for .env files, defaults to current working directory
    
  Examples:
  
    dotenv-run -- npm start
    dotenv-run -r ../.. -- npm start
    dotenv-run -e prod -- npm start
  `);
}

if (argv.h) {
  help();
} else {
  const cmd = argv._[0];
  if (!cmd) {
    help();
    process.exit(1);
  }
  const envPaths = rootExpand(argv.r, argv.e);
  if (!argv.s) {
    envPaths.forEach((envPath) => {
      console.log(`${chalk.green("✔")} ${envPath}`);
    });
  }
  run(cmd, argv._.slice(1));
}
