import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "./mdx-components";

export async function renderMdx(source: string) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
    },
  });
  return content;
}

/** @deprecated use renderMdx */
export const renderMdxBody = renderMdx;
