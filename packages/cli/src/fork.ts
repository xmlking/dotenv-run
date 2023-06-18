import { ChildProcess, fork as forkChild } from "child_process";

let childProcess: ChildProcess;

export const fork = (envPaths: string[], cmd: string, args: string[]) => {
  if (childProcess) {
    console.log("Killing child process");
    childProcess.kill();
    childProcess.on("exit", (code, signal) => {
      if (code === null) {
        // Child process terminated successfully
        console.log("Child process terminated");
        // Continue with your logic here
      } else {
        // Child process encountered an error or was terminated forcefully
        console.error(`Child process exited with code ${code}`);
      }
      // childProcess = forkChild(
      //   __dirname + "/child.js",
      //   [JSON.stringify(envPaths), cmd, ...args],
      //   {}
      // );
    });
  } else {
    childProcess = forkChild(
      __dirname + "/child.js",
      [JSON.stringify(envPaths), cmd, ...args],
      { detached: false }
    );
  }
};
