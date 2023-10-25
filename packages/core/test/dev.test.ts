import { it, expect } from "vitest";
import { expand, paths } from "../src";

it("should load dev environment", () => {
  expand(paths("dev", "./"));
  expect(process.env.API_USERS).toBe("https://dotenv-run.dev/api/v1/users");
});