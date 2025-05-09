import * as z from "zod";

export const createInstanceSchema = z.object({
  instanceName: z.string(),
  instanceType: z.string().optional(),
  cpu: z.number().optional(),
  memory: z.number().optional(),
  storage: z.number().optional(),
  dockerImage: z.string().optional(),
});

export const getInstanceSchema = z.object({
  id: z.string(),
});

export const startInstanceSchema = z.object({
  id: z.string(),
});

export const stopInstanceSchema = z.object({
  id: z.string(),
});

export const deleteInstanceSchema = z.object({
  id: z.string(),
});

export const streamLogsSchema = z.object({
  id: z.string(),
});

export const execCommandSchema = z.object({
  instanceId: z.string(),
  command: z.string(),
});

export const streamStatsSchema = z.object({
  instanceId: z.string(),
});

export const renameInstanceSchema = z.object({
  instanceId: z.string(),
  newName: z.string(),
});

export const backupInstanceSchema = z.object({
  instanceId: z.string().min(1),
  bucket: z.string().min(3),
  key: z.string().min(1).optional(),
});

export const restoreInstanceSchema = z.object({
  instanceName: z.string().min(1),
  instanceType: z.string().min(1),
  bucket: z.string().min(3),
  key: z.string().min(1),
  cpu: z.number().optional(),
  memory: z.number().optional(),
  storage: z.number().optional(),
});
