import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadRepositoryContent } from "./content.ts";

const root = fileURLToPath(new URL("..", import.meta.url));

export async function generateContent(): Promise<void> {
  const manifest = await loadRepositoryContent(root);
  const directory = resolve(root, "src/lib/server/generated");
  const output = resolve(directory, "content.json");
  const serialized = JSON.stringify(manifest);
  await mkdir(directory, { recursive: true });
  const previous = await readFile(output, "utf8").catch(() => "");
  if (previous !== serialized) {
    await writeFile(`${output}.tmp`, serialized);
    await rename(`${output}.tmp`, output);
  }
  console.log(
    `Generated ${manifest.posts.length} posts, About, graph, and search records.`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await generateContent();
}
