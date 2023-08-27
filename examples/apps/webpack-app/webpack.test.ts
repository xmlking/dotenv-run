import { execSync } from "child_process";
import { describe, it, expect } from "vitest";

describe("dotenv-run should give the expected output", () => {
  it("empty", () => {
    const actual = execSync("node dist/main.js", { encoding: "utf8" });
    expect(actual).toMatchSnapshot();
  });

  it("dev", () => {
    const actual = execSync("NODE_ENV=dev node dist/main.js", {
      encoding: "utf8",
    });
    expect(actual).toMatchSnapshot();
  });

  it("prod", () => {
    const actual = execSync("NODE_ENV=prod node dist/main.js", {
      encoding: "utf8",
    });
    expect(actual).toMatchSnapshot();
  });
});
