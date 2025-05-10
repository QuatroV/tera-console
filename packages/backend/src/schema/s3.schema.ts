import { z } from "zod";

export const createBucketSchema = z.object({ name: z.string().min(3) });

export const deleteBucketSchema = z.object({ name: z.string().min(3) });

export const renameBucketSchema = z.object({
  oldName: z.string().min(3),
  newName: z.string().min(3),
});

export const listObjectsSchema = z.object({
  bucket: z.string().min(3),
  prefix: z.string().optional().default(""),
});

export const createFolderSchema = z.object({
  bucket: z.string(),
  prefix: z.string().endsWith("/"),
});

export const keyInputSchema = z.object({
  bucket: z.string().min(3),
  key: z.string().min(1),
});

export const bucketSettingsSchema = z.object({
  bucket: z.string(),
  publicRead: z.boolean(),
  versioning: z.boolean(),
  accessLogging: z.boolean().optional(),
  encryption: z.boolean().optional(),
  expirationDays: z.number().int().positive().optional(),
});
