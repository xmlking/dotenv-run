import { DotenvRunOptions, plugin } from "@dotenv-run/core";
import replace from "@rollup/plugin-replace";

export default function (options: DotenvRunOptions, cwd: string) {
  const { full } = plugin(options, cwd);
  return {
    ...replace({
      preventAssignment: true,
      values: full,
    }),
  };
}
