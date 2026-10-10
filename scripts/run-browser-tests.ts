import { type ChildProcess, spawn } from "node:child_process";
import { createWriteStream, mkdirSync } from "node:fs";
import { delimiter, dirname } from "node:path";
import { setTimeout } from "node:timers/promises";
import { stripVTControlCharacters } from "node:util";

// Start only test-owned servers. Keep the caller's development server intact.
mkdirSync("test-results", { recursive: true });
const baseURL = "http://127.0.0.1:5175";
const configuredURL = "http://127.0.0.1:4175";
const children: ChildProcess[] = [];
const listening = new WeakSet<ChildProcess>();
const logs: ReturnType<typeof createWriteStream>[] = [];
const serverOutput = new WeakMap<ChildProcess, string>();
const environment = {
  ...process.env,
  PATH: dirname(process.execPath) + delimiter + process.env.PATH,
};
function server(name: string, args: string[], env: NodeJS.ProcessEnv) {
  const log = createWriteStream(`test-results/${name}.log`);
  const child = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      ...args,
      "--host",
      "127.0.0.1",
      "--strictPort",
    ],
    { env: { ...environment, ...env }, stdio: ["ignore", "pipe", "pipe"] },
  );
  const address = `http://127.0.0.1:${args[args.indexOf("--port") + 1]}`;
  let output = "";
  child.stdout?.on("data", (chunk: Buffer) => {
    output = (output + chunk.toString()).slice(-10_000);
    serverOutput.set(child, output);
    if (stripVTControlCharacters(output).includes(address))
      listening.add(child);
  });
  child.stderr?.on("data", (chunk: Buffer) => {
    serverOutput.set(child, (serverOutput.get(child) ?? "") + chunk.toString());
  });
  child.stdout?.pipe(log, { end: false });
  child.stderr?.pipe(log, { end: false });
  children.push(child);
  logs.push(log);
  return child;
}
async function ready(child: ChildProcess, url: string) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null || child.signalCode !== null)
      throw new Error(
        `Test server exited: ${url}\n${serverOutput.get(child) ?? ""}`,
      );
    if (!listening.has(child)) {
      await setTimeout(100);
      continue;
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {
      /* Server is still starting. */
    }
    await setTimeout(100);
  }
  throw new Error(
    `Test server did not become ready: ${url}\n${serverOutput.get(child) ?? ""}`,
  );
}
async function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const abort = new AbortController();
  const exited = new Promise<void>((resolve) =>
    child.once("exit", () => resolve()),
  );
  child.kill("SIGTERM");
  try {
    const timeout = setTimeout(5000, undefined, { signal: abort.signal }).then(
      () => {
        child.kill("SIGKILL");
        return exited;
      },
    );
    await Promise.race([exited, timeout]);
  } finally {
    abort.abort();
  }
}
try {
  const dev = server("development", ["--port", "5175"], {
    ALGOLIA_APP_ID: "",
    ALGOLIA_SEARCH_API_KEY: "",
    ALGOLIA_INDEX_NAME: "",
    GA4_MEASUREMENT_ID: "",
  });
  const preview = server("preview", ["preview", "--port", "4175"], {
    ALGOLIA_APP_ID: "LOCALTEST",
    ALGOLIA_SEARCH_API_KEY: "browser-test-search-only-key",
    ALGOLIA_INDEX_NAME: "local-test",
    ALGOLIA_ADMIN_API_KEY: "browser-test-admin-key-must-stay-private",
    GA4_MEASUREMENT_ID: "G-LOCALTEST",
  });
  await Promise.all([ready(dev, baseURL), ready(preview, configuredURL)]);
  const runner = spawn(
    process.execPath,
    [
      "--test",
      "--test-concurrency=1",
      "--test-timeout=60000",
      "__tests__/browser/*.test.ts",
    ],
    {
      env: {
        ...environment,
        BROWSER_BASE_URL: baseURL,
        BROWSER_CONFIGURED_URL: configuredURL,
      },
      stdio: "inherit",
    },
  );
  children.push(runner);
  process.exitCode = await new Promise<number>((resolve, reject) => {
    runner.once("error", reject);
    runner.once("exit", (code) => resolve(code ?? 1));
  });
} finally {
  await Promise.all(children.map(stop));
  for (const log of logs) log.end();
}
