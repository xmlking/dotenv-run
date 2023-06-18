#!/usr/bin/env node

import { paths } from "@dotenv-run/core";
import * as chalk from "chalk";
import * as findUp from "find-up";
import * as minimist from "minimist";
import * as path from "path";
import { fork } from "./fork";
import * as chokidar from "chokidar";

const argv = minimist(process.argv.slice(2), {
  string: ["root"],
  boolean: ["silent"],
  alias: { help: "h", silent: "s", root: ["e", "r"] },
});

function help() {
  console.log(`
  Usage: dotenv-run [options] -- <command>
  
  Options:
  
    -h, --help     output usage information
    -s, --silent   do not print .env file paths
    -w, --watch    watch for changes in .env files
    -r, --root     root directory to search for .env files, defaults to current working directory
    
  Examples:
  
    dotenv-run -w -- npm start
    dotenv-run -r ../.. -- npm build
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
    let p = findUp.sync([
      "turbo.json",
      "nx.json",
      "lerna.json",
      "pnpm-workspace.yaml",
    ]);
    if (!p) p = findUp.sync(["package.json"]);
    argv.r = p ? path.dirname(p) : process.cwd();
  }
  const envPaths = paths(process.env.NODE_ENV, argv.r);
  if (!argv.s) {
    envPaths.forEach((envPath) => {
      console.log(`${chalk.green("✔")} ${envPath}`);
    });
  }
  const watcher = chokidar.watch(envPaths, { persistent: true });
  fork(envPaths, cmd, argv._.slice(1));
  if (argv.w) {
    console.log(`${chalk.green("✔")} watching for changes...`);
    watcher.on("change", (path) => {
      console.log(`${chalk.green("✔")} ${path} changed`);
      fork(envPaths, cmd, argv._.slice(1));
    });
  }
}
