import { assertEquals, assertStringIncludes } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { render } from "@/test-support/preact.ts";
import { SEO } from "@/components/SEO.tsx";
import { GoogleAnalytics } from "@/components/GoogleAnalytics.tsx";
import { author as siteAuthor } from "@/utils/website.ts";

describe("SEO", () => {
  it("renders basic meta tags for website type", () => {
    const { container } = render(
      <SEO
        title="Test Title"
        description="Test Description"
        ogImage="https://example.com/image.png"
        ogUrl="https://example.com"
        keywords="test,seo"
      />,
    );

    const titleEl = container.querySelector("title");
    assertEquals(titleEl?.textContent, "Test Title");

    const descMeta = container.querySelector('meta[name="description"]');
    assertEquals(descMeta?.getAttribute("content"), "Test Description");

    const ogTypeMeta = container.querySelector('meta[property="og:type"]');
    assertEquals(ogTypeMeta?.getAttribute("content"), "website");

    const keywordsMeta = container.querySelector('meta[name="keywords"]');
    assertEquals(keywordsMeta?.getAttribute("content"), "test,seo");
  });

  it("renders article meta tags including publishedAt and author", () => {
    const pubDate = new Date("2024-01-01T00:00:00Z");
    const { container } = render(
      <SEO
        title="Article Title"
        description="Article Description"
        ogImage="https://example.com/image.png"
        ogUrl="https://example.com/article"
        ogType="article"
        publishedAt={pubDate}
        keywords="article,test"
      />,
    );

    const publishedMeta = container.querySelector(
      'meta[property="article:published_time"]',
    );
    assertEquals(publishedMeta?.getAttribute("content"), pubDate.toISOString());

    const authorMeta = container.querySelector(
      'meta[property="article:author"]',
    );
    assertEquals(authorMeta?.getAttribute("content"), siteAuthor);
  });
});

describe("GoogleAnalytics", () => {
  it("renders null when measurementId is not provided", () => {
    const { container } = render(<GoogleAnalytics />);
    assertEquals(container.childNodes.length, 0);
  });

  it("renders script tags when measurementId is provided", () => {
    const { container } = render(
      <GoogleAnalytics measurementId="G-123456" />,
    );

    const asyncScript = container.querySelector(
      'script[src="https://www.googletagmanager.com/gtag/js?id=G-123456"]',
    );
    assertEquals(asyncScript !== null, true);

    const inlineScript = container.querySelector('script[type="text/javascript"]');
    assertEquals(inlineScript !== null, true);
    assertStringIncludes(inlineScript?.textContent ?? "", "gtag('config', 'G-123456');");
  });
});
