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

export const workCategorySchema = z.enum([
  "PHP",
  "Python",
  "TypeScript",
  "IoT",
]);

export const geoSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string(),
});

export const workFrontmatterSchema = baseFrontmatterSchema.extend({
  role: z.string().optional(),
  repoUrl: z.string().url(),
  demoUrl: z.string().url().optional(),
  tech: z.array(z.string()).default([]),
  categories: z.array(workCategorySchema).default([]),
  featured: z.boolean().default(false),
  detailPage: z.boolean().default(true),
});

export const fieldNotesFrontmatterSchema = baseFrontmatterSchema.extend({
  route: z.string().optional(),
  estimatedCost: z.string().optional(),
  bestSeason: z.string().optional(),
  geo: geoSchema.optional(),
  youtubeVideoId: z.string().optional(),
  featured: z.boolean().default(false),
});

export type BaseFrontmatter = z.infer<typeof baseFrontmatterSchema>;
export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;
export type FieldNotesFrontmatter = z.infer<typeof fieldNotesFrontmatterSchema>;

export const pageFrontmatterSchema = baseFrontmatterSchema.extend({
  summary: z.string().min(1).optional(),
});

export type PageFrontmatter = z.infer<typeof pageFrontmatterSchema>;

export type CollectionId = "work" | "writing" | "field-notes" | "pages";

export const collectionSchemas: Record<CollectionId, z.ZodTypeAny> = {
  work: workFrontmatterSchema,
  writing: baseFrontmatterSchema,
  "field-notes": fieldNotesFrontmatterSchema,
  pages: pageFrontmatterSchema,
};
