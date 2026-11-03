import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPICS } from './site.config';

/** Keep ids as the file path without extension: "<slug>/ko", "<slug>/en". */
const pathId = ({ entry }: { entry: string }) => entry.replace(/\.(md|mdx|ya?ml)$/i, '');

/**
 * Posts: one folder per post, one file per language.
 *   src/content/posts/<slug>/ko.md
 *   src/content/posts/<slug>/en.md   (optional translation, same slug)
 */
const posts = defineCollection({
  loader: glob({ pattern: '*/{ko,en}.{md,mdx}', base: './src/content/posts', generateId: pathId }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1).max(240),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      topics: z.array(z.enum(TOPICS)).min(1),
      tags: z.array(z.string().min(1)).default([]),
      thumbnail: image().optional(),
      thumbnailAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

/** Timeline entries that are not posts: career moves, projects, talks, site changes. */
const timeline = defineCollection({
  loader: glob({ pattern: '*/{ko,en}.md', base: './src/content/timeline', generateId: pathId }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    kind: z.enum(['career', 'project', 'talk', 'writing', 'site', 'note']),
    link: z.url().optional(),
  }),
});

/** Prose pages such as About: src/content/pages/about.ko.md */
const pages = defineCollection({
  loader: glob({ pattern: '*.{ko,en}.md', base: './src/content/pages', generateId: pathId }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
  }),
});

const period = z.object({ start: z.string().min(4), end: z.string().optional() });

/**
 * Résumé data per language: src/content/resume/ko.yaml, en.yaml. Empty sections are hidden.
 * fixture-ko.yaml / fixture-en.yaml are labelled synthetic data used only in SHOW_DRAFTS builds.
 */
const resume = defineCollection({
  loader: glob({
    pattern: '{ko,en,fixture-ko,fixture-en}.{yaml,yml}',
    base: './src/content/resume',
    generateId: pathId,
  }),
  schema: z.object({
    profile: z.object({
      name: z.string().min(1),
      role: z.string().optional(),
      summary: z.string().optional(),
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
    }),
    experience: z
      .array(
        z.object({
          period,
          company: z.string(),
          role: z.string(),
          url: z.url().optional(),
          summary: z.string().optional(),
          highlights: z.array(z.string()).default([]),
          stack: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    projects: z
      .array(
        z.object({
          name: z.string(),
          period: period.optional(),
          url: z.url().optional(),
          description: z.string(),
          stack: z.array(z.string()).default([]),
        }),
      )
      .default([]),
    openSource: z
      .array(z.object({ name: z.string(), url: z.url(), description: z.string().optional() }))
      .default([]),
    talks: z
      .array(z.object({ date: z.string(), title: z.string(), event: z.string(), url: z.url().optional() }))
      .default([]),
    publications: z
      .array(z.object({ year: z.string(), title: z.string(), url: z.url().optional(), note: z.string().optional() }))
      .default([]),
    skills: z.array(z.object({ category: z.string(), items: z.array(z.string()).min(1) })).default([]),
    education: z
      .array(z.object({ period, school: z.string(), detail: z.string().optional() }))
      .default([]),
  }),
});

export const collections = { posts, timeline, pages, resume };
