import { expand } from "@dotenv-run/core";
import * as spawn from "cross-spawn";

export const run = (envPaths: string[], cmd: string, args: string[]) => {
    expand(envPaths);
    spawn(cmd, args, { stdio: "inherit" }).on(
        "exit",
        function (exitCode, signal) {
            if (typeof exitCode === "number") {
                process.exit(exitCode);
            } else {
                process.kill(process.pid, signal);
            }
        }
    )
}
