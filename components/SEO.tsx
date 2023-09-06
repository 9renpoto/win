import { author } from "@/utils/website.ts";

export const SEO = ({ title, description, ogImage, keywords }: {
  title: string;
  description: string;
  ogImage: string;
  keywords: string;
}) => (
  <>
    <title>{title}</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content="jp_JA" />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:creator" content={author} />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image:src" content={ogImage} />
    <meta name="keywords" content={keywords} />
  </>
);
