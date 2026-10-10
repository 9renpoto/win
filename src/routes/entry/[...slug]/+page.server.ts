import { error } from "@sveltejs/kit";
import { getPost } from "#lib/server/posts.ts";
import type { PageServerLoad } from "./$types";
export const load: PageServerLoad = ({ params }) => {
  const post = getPost(params.slug);
  if (!post) error(404, "Article not found");
  return { post };
};
