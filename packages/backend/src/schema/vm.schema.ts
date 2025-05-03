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
