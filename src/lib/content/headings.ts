import type { Heading } from "../types.ts";
export interface HeadingNode extends Heading {
  children: HeadingNode[];
}

export function buildHeadingTree(headings: Heading[]): HeadingNode[] {
  const roots: HeadingNode[] = [];
  const stack: HeadingNode[] = [];
  for (const heading of headings) {
    const node: HeadingNode = { ...heading, children: [] };
    while (stack.length && stack[stack.length - 1].level >= node.level)
      stack.pop();
    if (stack.length) stack[stack.length - 1].children.push(node);
    else roots.push(node);
    stack.push(node);
  }
  return roots;
}
