import * as fs from "fs";
import * as path from "path";
import * as findUp from "find-up";
import { readFileSync } from "node:fs";

export function isSubfolder(parent: string, child: string) {
  return path.relative(parent, child).startsWith("..");
}

export function getAbsoluteEnvPath(envPath: string, cwd: string) {
  const _envPath = path.isAbsolute(envPath)
    ? envPath
    : path.resolve(cwd, envPath);
  return fs.existsSync(_envPath)
    ? fs.lstatSync(_envPath).isDirectory()
      ? _envPath
      : path.dirname(_envPath)
    : cwd;
}

export function getPathsDownTo(envPath: string, destination: string) {
  let currentPath = destination;
  const paths = [currentPath];
  while (currentPath !== envPath && currentPath !== "/") {
    currentPath = path.dirname(currentPath);
    paths.push(currentPath);
  }
  return paths;
}

/**
 * Return root `turbo.json` file path if found, else return original input.
 *
 * @param turboPath existing turbo.json file path.
 * @throws {Error} if `turboPath` is not exist.
 */
export function getTurboRoot(turboPath: string): string {
  // test if file content has `"extends": ["//"]`
  const isSubProject = readFileSync(turboPath, "utf8").includes('"extends"');
  const parent = path.dirname(path.dirname(turboPath))
  if(isSubProject) {
    const rootPath = findUp.sync("turbo.json", {cwd: parent})
    if(rootPath) return rootPath
  }
  return turboPath;
}
