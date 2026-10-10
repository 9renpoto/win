import { posts } from "#lib/server/posts.ts";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = () => ({ count: posts.length });
