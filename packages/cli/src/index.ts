#!/usr/bin/env node

import { paths } from "@dotenv-run/core";
import * as chalk from "chalk";
import * as findUp from 'find-up';
import * as minimist from "minimist";
import * as path from 'path';
import { run } from "./run";

const argv = minimist(process.argv.slice(2), {
  string: ["root", "env"],
  boolean: ["silent"],
  alias: { help: "h", silent: "s", root: "r", env: "e" }
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
  if (!argv.r) {
    let p = findUp.sync(['turbo.json', 'nx.json', 'lerna.json', 'pnpm-workspace.yaml']);
    if (!p)
      p = findUp.sync(['package.json']);
    argv.r = p ? path.dirname(p) : process.cwd();
  }
  const envPaths = paths(argv.e || process.env.NODE_ENV, argv.r);
  if (!argv.s) {
    envPaths.forEach((envPath) => {
      console.log(`${chalk.green("✔")} ${envPath}`);
    });
  }
  run(envPaths, cmd, argv._.slice(1));
}
