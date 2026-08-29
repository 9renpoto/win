import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import BlogIndexPage, { handler } from "@/routes/index.tsx";
import HealthPage, { handler as healthHandler } from "@/routes/healthz.tsx";
import AboutPage, { handler as aboutHandler } from "@/routes/about/index.tsx";
import PostPage, { handler as entryHandler } from "@/routes/entry/[...all].tsx";
import NotFoundPage from "@/routes/_404.tsx";
import AppLayout from "@/routes/_app.tsx";
import { handler as middlewareHandler } from "@/routes/_middleware.ts";

describe("routes/index.tsx", () => {
  it("handler GET fetches posts and paginates", async () => {
    const req = new Request("https://example.com/");
    const res =
      await (handler as { GET: (ctx: { req: Request }) => Promise<any> }).GET({
        req,
      });
    assert(res);
    assert(res.data);
    assert(Array.isArray(res.data.posts));
  });

  it("renders BlogIndexPage component", () => {
    const props = {
      data: {
        posts: [
          {
            slug: "test-post",
            title: "Test Post",
            publishedAt: "2024-01-01T00:00:00.000Z",
            snippet: "Test Snippet",
          },
        ],
        hasMore: false,
      },
    } as any;
    const { getByText } = render(<BlogIndexPage {...props} />);
    assert(getByText("Test Post"));
  });
});

describe("routes/healthz.tsx", () => {
  it("handler GET fetches posts count", async () => {
    const req = new Request("https://example.com/healthz");
    const res =
      await (healthHandler as { GET: (ctx: { req: Request }) => Promise<any> })
        .GET({ req });
    assert(res);
    assert(Array.isArray(res.data));
  });

  it("renders HealthPage component", () => {
    const posts = [
      {
        slug: "p1",
        title: "P1",
        publishedAt: new Date(),
        snippet: "",
        content: "",
        html: "",
      },
    ];
    const props = { data: posts } as any;
    const { getByText } = render(<HealthPage {...props} />);
    assert(getByText("This blog has 1 entries."));
  });
});

describe("routes/about/index.tsx", () => {
  it("handler GET fetches about post", async () => {
    const req = new Request("https://example.com/about");
    const res =
      await (aboutHandler as { GET: (ctx: { req: Request }) => Promise<any> })
        .GET({ req });
    assert(res);
    assert(res.data);
    assertEquals(res.data.slug, "about");
  });

  it("renders AboutPage component", () => {
    const post = {
      slug: "about",
      title: "About Me",
      publishedAt: new Date("2024-01-01"),
      snippet: "About snippet",
      content: "About content",
      html: "<p>About content HTML</p>",
    };
    const props = { data: post } as any;
    const { getByText } = render(<AboutPage {...props} />);
    assert(getByText("About Me"));
  });
});

describe("routes/entry/[...all].tsx", () => {
  it("handler GET fetches post by slug parameter", async () => {
    const req = new Request(
      "https://example.com/entry/2020/01/26/paper-stress",
    );
    const ctx = { req, params: { all: "2020/01/26/paper-stress" } } as any;
    const res = await (entryHandler as { GET: (ctx: any) => Promise<any> }).GET(
      ctx,
    );
    assert(res);
    assert(res.data);
    assertEquals(res.data.slug, "2020/01/26/paper-stress");
  });

  it("renders PostPage component", () => {
    const post = {
      slug: "2020/01/26/paper-stress",
      title: "Paper Stress",
      publishedAt: new Date("2024-01-01"),
      snippet: "Snippet",
      content: "Content with word count test",
      html: "<p>Content</p>",
      headings: [{ level: 1, text: "Heading 1", slug: "heading-1" }],
    };
    const props = { data: post } as any;
    const { getByText } = render(<PostPage {...props} />);
    assert(getByText("Paper Stress"));
  });
});

describe("routes/_404.tsx", () => {
  it("renders NotFoundPage component with URL", () => {
    const props = { url: new URL("https://example.com/not-found") } as any;
    const { getByText } = render(<NotFoundPage {...props} />);
    assert(getByText("404 not found https://example.com/not-found"));
  });
});

describe("routes/_app.tsx", () => {
  it("renders AppLayout component", () => {
    const Component = () => <div>App Content</div>;
    const props = { Component } as any;
    const { getByText } = render(<AppLayout {...props} />);
    assert(getByText("App Content"));
  });
});

describe("routes/_middleware.ts", () => {
  it("passes request to ctx.next()", async () => {
    const ctx = {
      next: () => Promise.resolve(new Response("ok")),
    } as any;
    const res = await middlewareHandler(ctx);
    assertEquals(await res.text(), "ok");
  });
});
