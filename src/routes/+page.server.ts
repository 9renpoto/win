import { getPostPage } from "#lib/server/posts.ts";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = () => getPostPage();
