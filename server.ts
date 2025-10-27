import "@/utils/window-polyfill.ts";
import server, { registerStaticFile } from "./_fresh/server/server-entry.mjs";

export { registerStaticFile };

export default {
  fetch: server.fetch,
};
