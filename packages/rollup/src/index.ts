import { DotenvRunOptions, env } from "@dotenv-run/core";
import replace from "@rollup/plugin-replace";

export default function (options: DotenvRunOptions) {
  const { full } = env(options);
  return {
    ...replace({
      preventAssignment: true,
      values: full,
    }),
  };
}

export { DotenvRunOptions };
