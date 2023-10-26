import { DotenvRunOptions, env, Dict } from "@dotenv-run/core";
import type { Plugin } from "esbuild";
import fs from "fs";

const dotenvRun = (options: DotenvRunOptions): Plugin => {
  return {
    name: "dotenv-run",
    setup(build) {
      let full: Dict = undefined;
      let contents: string = undefined;

      build.onStart(() => {
        full = env(options).full;
      });

      build.onLoad({ filter: /.*/ }, async ({ path }) => {
        try {
          contents = await fs.promises.readFile(path, "utf8");
          Object.entries(full).forEach(([key, value]) => {
            contents = contents.replace(key, value);
          });
          return undefined;
        } catch (error) {
          console.error("Error in onLoad 1:", error);
          throw error;
        }
      });

      build.onLoad({ filter: /.*/ }, () => {
        return {
          contents,
        };
      });
    },
  };
};

export { dotenvRun, DotenvRunOptions };
export default dotenvRun;
