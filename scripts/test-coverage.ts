import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";

mkdirSync("coverage", { recursive: true });
const result = spawnSync(
  process.execPath,
  [
    "--import",
    "./scripts/register-svelte-tests.ts",
    "--test",
    "--experimental-test-coverage",
    "--test-coverage-include=src/**/*.ts",
    "--test-coverage-include=scripts/content.ts",
    "--test-reporter=spec",
    "--test-reporter-destination=stdout",
    "--test-reporter=lcov",
    "--test-reporter-destination=coverage/lcov.info",
    "__tests__/utils/*.test.ts",
    "__tests__/routes/*.test.ts",
    "__tests__/components/*.test.ts",
  ],
  { stdio: "inherit" },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
