import { it, expect } from "vitest";
import { expand, paths } from "../src";

it("should load prod environment", () => {
  expand(paths("prod", "./"));
  expect(process.env.API_USERS).toBe("https://dotenv-run.app/api/v1/users");
});
