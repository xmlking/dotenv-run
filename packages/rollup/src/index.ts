import { DotenvRunOptions, plugin } from "@dotenv-run/core";
import replace from "@rollup/plugin-replace";

export default function (options: DotenvRunOptions) {
  const { full } = plugin(options);
  return {
    ...replace({
      preventAssignment: true,
      values: full,
    }),
  };
}

export { DotenvRunOptions };
