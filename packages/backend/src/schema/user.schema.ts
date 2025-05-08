import { z } from "zod";

export const updateMeSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  photo: z.string().url("Должна быть ссылка").optional(),
  password: z.string().min(6).max(100).optional(),
});
