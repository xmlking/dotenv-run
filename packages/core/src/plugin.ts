import { paths, expand, filter, Env } from "./env.js";
import * as chalk from "chalk";

export interface DotenvRunOptions {
  appEnv?: string;
  cwd?: string;
  prefix?: string;
  root?: string;
  verbose?: boolean;
}

export type Dict = Record<string, string>;

export type DotenvRun = {
  raw: Dict;
  stringified: Dict;
  full: Dict;
};

function prepareEnv(processEnv: any) {
  const values = Object.keys(processEnv)
    .filter((key) => key !== "NODE_ENV")
    .reduce<DotenvRun>(
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

function print(
  options: DotenvRunOptions,
  envPaths: string[],
  appEnv: string,
  values: Env
) {
  console.log("---------------------------------");
  console.log(`${chalk.green("-")} Verbose: `, options.verbose);
  console.log(`${chalk.green("-")} Prefix: `, options.prefix);
  console.log(`${chalk.green("-")} Root directory: `, options.root);
  console.log(`${chalk.green("-")} Working directory: `, options.cwd);
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

export function env(options: DotenvRunOptions = {}) {
  options.appEnv = options.appEnv ?? "NODE_ENV";
  options.root = options.root ?? ".";

  const appEnv = process.env[options.appEnv] ?? process.env.NODE_ENV;
  const envPaths = paths(appEnv, options.root ?? ".", options.cwd);
  expand(envPaths);
  const values = filter(process.env, new RegExp(options.prefix, "i"));
  if (options.verbose) {
    print(options, envPaths, appEnv, values);
  }
  return prepareEnv({ ...values, [options.appEnv]: appEnv });
}

export const plugin = env;
