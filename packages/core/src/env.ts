import { config } from "dotenv";
import { getAbsoluteEnvPath, getPathsDownTo, isSubfolder, getTurboRoot } from "./utils.js";
import { expand as dotenvExpand } from "dotenv-expand";
import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";

export type Env = Record<string, string>;

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

export function filter(env: Env, prefix: RegExp): Env {
  return Object.keys(env)
    .filter((key) => prefix.test(key))
    .sort() // sort keys to make output more deterministic
    .reduce<Env>((env, key) => {
      env[key] = process.env[key];
      return env;
    }, {});
}

export function paths(
  environment: string,
  root: string,
  cwd = process.cwd(),
  envFiles: string | string[] = []
): string[] {
  const _root = getAbsoluteEnvPath(root, cwd); // resolved path to .env file
  let envPaths: string[] = [];
  if (isSubfolder(_root, cwd)) {
    envPaths = [_root];
  } else {
    envPaths = getPathsDownTo(_root, cwd);
  }

  // Convert string | string[] -->  string[]
  envFiles = Array.isArray(envFiles) ? envFiles : [envFiles]
  // Remove empty strings
  const filteredEnvFiles = envFiles.filter((envFile) => envFile.trim().length > 0);
  // Remove duplicate strings and add `.env`
  const uniqueEnvFiles = Array.from(new Set(filteredEnvFiles).add('.env'));

  return envPaths
    .flatMap((envPath) => uniqueEnvFiles.map(envFile => path.join(envPath, envFile)) )
    .flatMap((envPath) => buildEnvFiles(environment, envPath))
    .filter((envPath) => fs.existsSync(envPath));
}

export function rootExpand(root?: string, environment?: string, envFiles?: string | string[]): string[] {
  if (!root) {
    let p = findUp.sync([
      "turbo.json",
      "nx.json",
      "lerna.json",
      "pnpm-workspace.yaml",
    ]);

    if(p && p.endsWith("turbo.json")) {
      p = getTurboRoot(p)
    }

    if (!p) p = findUp.sync(["package.json"]);
    root = p ? path.dirname(p) : process.cwd();
  }
  const _paths = paths(environment || process.env.NODE_ENV, root, undefined, envFiles);
  expand(_paths);
  return _paths;
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
