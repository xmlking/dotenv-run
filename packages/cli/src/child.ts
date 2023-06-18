import { expand } from "@dotenv-run/core";
import * as spawn from "cross-spawn";

const [_envPaths, cmd, ...args] = process.argv.slice(2);
const envPaths = JSON.parse(_envPaths);
expand(envPaths);

const child = spawn(cmd, args, { stdio: "inherit", detached: false })
  .on("exit", function (exitCode, signal) {
    console.log("Spawn process killed", exitCode);
    if (typeof exitCode === "number") {
      process.exit(exitCode);
    } else {
      process.kill(process.pid, signal);
    }
  })
  .on("parentExit", function (exitCode, signal) {
    console.log("Parent process killed", exitCode);
  });

process.on("exit", function () {
  console.log("Caught interrupt signal");
  child.kill();
});
