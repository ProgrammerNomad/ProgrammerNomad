import { z } from "zod";

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const baseFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1),
  date: isoDate,
  updatedAt: isoDate.optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  ogImage: z.string().optional(),
});

export const workFrontmatterSchema = baseFrontmatterSchema.extend({
  role: z.string().optional(),
});

export type BaseFrontmatter = z.infer<typeof baseFrontmatterSchema>;
export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;

export const pageFrontmatterSchema = baseFrontmatterSchema.extend({
  summary: z.string().min(1).optional(),
});

export type PageFrontmatter = z.infer<typeof pageFrontmatterSchema>;

export type CollectionId = "work" | "writing" | "field-notes" | "pages";

export const collectionSchemas: Record<CollectionId, z.ZodTypeAny> = {
  work: workFrontmatterSchema,
  writing: baseFrontmatterSchema,
  "field-notes": baseFrontmatterSchema,
  pages: pageFrontmatterSchema,
};
