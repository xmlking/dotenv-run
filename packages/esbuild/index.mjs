import { build } from "esbuild";
import * as env from "./dist/cjs/index.js";

await build({
    write: true,
    bundle: true,
    entryPoints: [`test/app.js`],
    plugins: [
      env.dotenvRun({
        prefix: "MY_",
        verbose: true,
      }),
    ],
  });