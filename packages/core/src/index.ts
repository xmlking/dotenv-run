import { expand as dotenvExpand } from "dotenv-expand";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";

export type Env = Record<string, string>;

function isSubfolder(parent: string, child: string) {
  return path.relative(parent, child).startsWith("..");
}

function getAbsoluteEnvPath(envPath: string, cwd: string) {
  const _envPath = path.isAbsolute(envPath)
    ? envPath
    : path.resolve(cwd, envPath);
  return fs.existsSync(_envPath)
    ? fs.lstatSync(_envPath).isDirectory()
      ? _envPath
      : path.dirname(_envPath)
    : cwd;
}

function getPathsDownTo(envPath: string, destination: string) {
  let currentPath = destination;
  const paths = [currentPath];
  while (currentPath !== envPath && currentPath !== "/") {
    currentPath = path.dirname(currentPath);
    paths.push(currentPath);
  }
  return paths;
}

function buildEnvFiles(environment: string, envPath: string) {
  return [
    environment !== "test" && `${envPath}.${environment}.local`, // .env.development.local, .env.test.local, .env.production.local
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    environment && `${envPath}.${environment}`, // .env.development, .env.test, .env.production
    environment !== "test" && `${envPath}.local`, // .env.local
    envPath, // .env
  ].filter(Boolean);
}

export function paths(environment: string, root: string, cwd = process.cwd()) {
  const _root = getAbsoluteEnvPath(root, cwd); // resolved path to .env file
  let envPaths: string[] = [];
  if (isSubfolder(_root, cwd)) {
    envPaths = [_root];
  } else {
    envPaths = getPathsDownTo(_root, cwd);
  }
  return envPaths
    .map((envPath) => path.join(envPath, ".env"))
    .flatMap((envPath) => buildEnvFiles(environment, envPath))
    .filter((envPath) => fs.existsSync(envPath));
}

export function expand(envPaths: string[]) {
  envPaths.forEach((dotenvFile) => {
    dotenvExpand(
      config({
        path: dotenvFile,
      })
    );
  });
}

export function filter(env: Env, prefix: RegExp): Env {
  return Object.keys(env)
    .filter((key) => prefix.test(key))
    .sort() // sort keys to make output more deterministic
    .reduce<Env>((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
}

export interface DotenvRunOptions {
  prefix?: string;
  root?: string;
  verbose?: boolean;
  appEnv?: string;
}

export type Dict = Record<string, string>;

function prepareEnv(processEnv: any) {
  const values = Object.keys(processEnv)
    .filter((key) => key !== "NODE_ENV")
    .reduce<{
      raw: Dict;
      stringified: Dict;
      full: Dict;
    }>(
      (env, key) => {
        const value = JSON.stringify(processEnv[key]);
        env.raw[key] = processEnv[key];
        env.stringified[key] = value;
        env.full[`process.env.${key}`] = value;
        env.full[`import.meta.env.${key}`] = value;
        return env;
      },
      {
        raw: {},
        stringified: {},
        full: {},
      }
    );
  return values;
}

export function plugin(options: DotenvRunOptions, cwd: string) {
  options.appEnv = options.appEnv ?? "NODE_ENV";
  options.root = options.root ?? ".";

  const appEnv = process.env[options.appEnv] ?? process.env.NODE_ENV;
  const envPaths = paths(appEnv, options.root ?? ".", cwd);
  expand(envPaths);
  const values = filter(process.env, new RegExp(options.prefix, "i"));
  if (options.verbose) {
    console.log("---------------------------------");
    console.log(`${chalk.green("-")} Verbose: `, options.verbose);
    console.log(`${chalk.green("-")} Prefix: `, options.prefix);
    console.log(`${chalk.green("-")} Root directory: `, options.root);
    console.log(`${chalk.green("-")} Working directory: `, cwd);
    console.log(`${chalk.green("-")} Environment files: `);
    envPaths.forEach((envPath) => {
      console.log(`${chalk.green(" ✔")} ${envPath}`);
    });
    console.log(`- Injected keys:`);
    console.log(`${chalk.green(" ✔")} ${options.appEnv} => ${appEnv}`);
    for (const key in values) {
      console.log(`${chalk.green(" ✔")} ${key}`);
    }
    console.log("---------------------------------\n");
  }
  return prepareEnv({ ...values, [options.appEnv]: appEnv });
}
