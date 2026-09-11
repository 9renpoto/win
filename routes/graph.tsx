import type { RouteHandler } from "fresh";
import { page, type PageProps } from "fresh";
import { Head } from "fresh/runtime";
import { SEO } from "@/components/SEO.tsx";
import GraphView from "@/islands/GraphView.tsx";
import { getGraphData, type GraphData } from "@/utils/graph.ts";
import { siteUrl, title } from "@/utils/website.ts";

export const handler: RouteHandler<GraphData, Record<string, never>> = {
  async GET(_ctx) {
    const data = await getGraphData();
    return page(data);
  },
};

export default function GraphPage({ data }: PageProps<GraphData>) {
  return (
    <>
      <Head>
        <SEO
          title={`Graph View | ${title}`}
          description={`Interactive graph view visualizing connections between articles on ${title}`}
          keywords={["graph", "notes", "obsidian", "articles"].join(",")}
          ogImage="https://avatars3.githubusercontent.com/u/520693?s=460&v=4"
          ogUrl={`${siteUrl}/graph`}
        />
      </Head>
      <main class="flex-grow max-w-screen-xl w-full px-4 pt-2 pb-6 mx-auto flex flex-col">
        <div class="mb-3">
          <h1 class="text-2xl font-bold">Graph View</h1>
          <p class="text-gray-500 text-sm mt-1">
            Visualizing connections between articles inspired by Obsidian.
          </p>
        </div>
        <div class="flex-grow">
          <GraphView initialData={data} />
        </div>
      </main>
    </>
  );
}
