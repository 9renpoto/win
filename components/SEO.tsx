import { author as siteAuthor, title as siteTitle } from "@/utils/website.ts";

export const SEO = ({
  title,
  description,
  ogImage,
  ogUrl,
  ogType = "website",
  publishedAt,
  keywords,
}: {
  title: string;
  description: string;
  ogImage: string;
  ogUrl: string;
  ogType?: "website" | "article";
  publishedAt?: Date;
  keywords: string;
}) => (
  <>
    <title>{title}</title>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={ogUrl} />
    <meta property="og:site_name" content={siteTitle} />
    <meta property="og:type" content={ogType} />
    <meta property="og:locale" content="ja_JP" />
    {ogType === "article" && publishedAt && (
      <meta
        property="article:published_time"
        content={publishedAt.toISOString()}
      />
    )}
    {ogType === "article" && (
      <meta property="article:author" content={siteAuthor} />
    )}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@9renpoto" />
    <meta name="twitter:creator" content="@9renpoto" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
    <meta name="keywords" content={keywords} />
  </>
);
