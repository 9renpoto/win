import type { h } from "preact";

interface Heading {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const renderList = (nodes: Heading[], level = 1) => {
    const list = [];
    while (nodes.length > 0) {
      const node = nodes.shift();
      if (!node) continue;
      if (node.level === level) {
        const children = [];
        while (nodes.length > 0 && nodes[0].level > level) {
          children.push(nodes.shift() as Heading);
        }
        list.push(
          <li key={node.slug}>
            <a href={`#${node.slug}`}>{node.text}</a>
            {children.length > 0 && renderList(children, level + 1)}
          </li>,
        );
      } else {
        nodes.unshift(node);
        return <ul class={`toc-level-${level}`}>{list}</ul>;
      }
    }
    return <ul class={`toc-level-${level}`}>{list}</ul>;
  };

  return (
    <aside class="toc">
      <h2>Table of Contents</h2>
      {renderList([...headings])}
    </aside>
  );
}
