import { DotenvRunOptions, plugin } from "@dotenv-run/core";
import * as webpack from "webpack";

export class DotenvRunPlugin {
  constructor(
    private options: DotenvRunOptions,
    private cwd: string,
    private ssr = false
  ) {}
  apply(compiler: webpack.Compiler) {
    const { full, stringified } = plugin(this.options, this.cwd);
    console.log("stringified", stringified);
    const definePlugin = new webpack.DefinePlugin(
      this.ssr
        ? { ...full }
        : {
            "process.env": stringified,
            "import.meta.env": stringified,
            "import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          }
    );
    definePlugin.apply(compiler);
  }
}
