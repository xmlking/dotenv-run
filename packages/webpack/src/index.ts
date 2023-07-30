import { DotenvRunOptions, Dict, plugin } from "@dotenv-run/core";
import * as webpack from "webpack";
class DotenvRunPlugin {
  public raw: Dict = {};
  public full: Dict = {};
  public stringified: Dict = {};

  constructor(private options: DotenvRunOptions, private ssr = false) {
    const { full, stringified, raw } = plugin(this.options);
    this.raw = raw;
    this.full = full;
    this.stringified = stringified;
  }

  apply(compiler: webpack.Compiler) {
    const definePlugin = new webpack.DefinePlugin(
      this.ssr
        ? { ...this.full }
        : {
            "process.env": this.stringified,
            "import.meta.env": this.stringified,
            "import.meta.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          }
    );
    definePlugin.apply(compiler);
  }
}

export { DotenvRunOptions, DotenvRunPlugin };

export default DotenvRunPlugin;
