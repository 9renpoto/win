import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import { compile } from "svelte/compiler";

// Compile Svelte templates for server rendering in the native Node test runner.
registerHooks({
  load(url, context, nextLoad) {
    if (!url.endsWith(".svelte")) return nextLoad(url, context);
    const filename = fileURLToPath(url);
    const { js } = compile(readFileSync(filename, "utf8"), {
      filename,
      generate: "server",
    });
    return { format: "module", source: js.code, shortCircuit: true };
  },
});
