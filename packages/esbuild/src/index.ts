import { type DotenvRunOptions, env } from "@dotenv-run/core";
import type { Plugin } from "esbuild";

const dotenvRun = (options: DotenvRunOptions): Plugin => {
  return {
    name: "dotenv-run",
    setup(build) {
      const full = env(options).full;;
      const define = build.initialOptions.define ?? {};
      build.initialOptions.define = {
        ...full,
        ...define,
      };
    },
  };
};

export { dotenvRun, DotenvRunOptions };
export default dotenvRun;
