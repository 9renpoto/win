import { title as siteTitle } from "@/utils/website.ts";

export const SEO = ({
  title,
  description,
  ogImage,
  keywords,
}: {
  title: string;
  description: string;
  ogImage: string;
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
    <meta property="og:site_name" content={siteTitle} />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="jp_JA" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content="9renpoto" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image:src" content={ogImage} />
    <meta name="keywords" content={keywords} />
    <link rel="stylesheet" href="/styles.css" />
  </>
);
