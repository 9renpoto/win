import { getPosts, type Post } from "./posts.ts";

export interface GraphNode {
  id: string;
  title: string;
  path: string;
  category?: string;
  publishedAt: string;
  linkCount: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const ENTRY_LINK_REGEX =
  /(?:https?:\/\/(?:[a-zA-Z0-9-]+\.)*(?:9renpoto\.win|win\.9renpoto\.com|github\.io))?\/entry\/([0-9]{4}\/[0-9]{2}\/[0-9]{2}\/[a-zA-Z0-9_\-\.]+)/g;

/**
 * Extracts unique valid internal post links from the markdown content.
 */
export function extractInternalLinks(
  content: string,
  currentSlug: string,
  validSlugs: Set<string>,
): string[] {
  const targets = new Set<string>();
  const matches = content.matchAll(ENTRY_LINK_REGEX);
  for (const match of matches) {
    let slug = match[1];
    if (slug.endsWith("/")) {
      slug = slug.slice(0, -1);
    }
    if (validSlugs.has(slug) && slug !== currentSlug) {
      targets.add(slug);
    }
  }
  return Array.from(targets);
}

/**
 * Builds nodes and edges for the graph view from a list of posts.
 */
export function buildGraphData(posts: Post[]): GraphData {
  const validSlugs = new Set(posts.map((p) => p.slug));
  const linkCounts = new Map<string, number>();

  for (const post of posts) {
    linkCounts.set(post.slug, 0);
  }

  const edges: GraphEdge[] = [];
  const edgeSet = new Set<string>();

  for (const post of posts) {
    const targets = extractInternalLinks(post.content, post.slug, validSlugs);
    for (const target of targets) {
      const edgeKey = `${post.slug}->${target}`;
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        edges.push({ source: post.slug, target });
        linkCounts.set(post.slug, (linkCounts.get(post.slug) ?? 0) + 1);
        linkCounts.set(target, (linkCounts.get(target) ?? 0) + 1);
      }
    }
  }

  const nodes: GraphNode[] = posts.map((post) => ({
    id: post.slug,
    title: post.title,
    path: `/entry/${post.slug}`,
    category: post.category,
    publishedAt: post.publishedAt.toISOString(),
    linkCount: linkCounts.get(post.slug) ?? 0,
  }));

  return { nodes, edges };
}

let cachedGraphData: GraphData | null = null;

/**
 * Returns graph data for all articles.
 */
export async function getGraphData(): Promise<GraphData> {
  if (cachedGraphData) {
    return cachedGraphData;
  }
  const posts = await getPosts();
  cachedGraphData = buildGraphData(posts);
  return cachedGraphData;
}

export function __resetGraphCache(): void {
  cachedGraphData = null;
}
