export interface Heading {
  level: number;
  text: string;
  slug: string;
}

export interface PostItem {
  slug: string;
  title: string;
  publishedAt: string;
  snippet: string;
}

export interface Post extends PostItem {
  mtime?: string;
  content: string;
  html: string;
  feedHtml: string;
  headings: Heading[];
  category?: string;
}

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

export interface SearchRecord extends PostItem {
  objectID: string;
  url: string;
  content: string;
  mtime?: string;
}

export interface ContentManifest {
  posts: Post[];
  about: Post;
  graph: GraphData;
  search: SearchRecord[];
}

export interface SearchConfig {
  appId: string;
  apiKey: string;
  indexName: string;
}
