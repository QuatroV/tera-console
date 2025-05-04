// src/routes/s3.route.ts
import { router, privateProcedure } from "../utils/trpc";
import { z } from "zod";
import * as S3 from "../services/s3.service";

const bucketInput = z.object({ bucket: z.string().min(3) });
const keyInput = z.object({
  bucket: z.string().min(3),
  key: z.string().min(1),
});

export const s3Router = router({
  listBuckets: privateProcedure.query(async () => ({
    status: "success",
    buckets: await S3.listBuckets(),
  })),

  createBucket: privateProcedure
    .input(z.object({ name: z.string().min(3) }))
    .mutation(async ({ input }) => {
      await S3.createBucket(input.name);
      return { status: "success" };
    }),

  listObjects: privateProcedure
    .input(
      z.object({
        bucket: z.string().min(3),
        prefix: z.string().optional().default(""),
      })
    )
    .query(async ({ input }) => {
      const { folders, files } = await S3.listObjects(
        input.bucket,
        input.prefix
      );
      return { status: "success", items: [...folders, ...files] };
    }),

  createFolder: privateProcedure
    .input(z.object({ bucket: z.string(), prefix: z.string().endsWith("/") }))
    .mutation(async ({ input }) => {
      // нулевой object создаёт «папку»
      await S3.putObject(input.bucket, input.prefix, new Uint8Array());
      return { status: "success" };
    }),

  putObjectPresigned: privateProcedure
    .input(keyInput)
    .mutation(async ({ input }) => {
      const url = await S3.presignedPut(input.bucket, input.key);
      return { status: "success", url };
    }),

  getObjectPresigned: privateProcedure
    .input(keyInput)
    .query(async ({ input }) => {
      const url = await S3.presignedGet(input.bucket, input.key);
      return { status: "success", url };
    }),

  deleteObject: privateProcedure.input(keyInput).mutation(async ({ input }) => {
    await S3.removeObject(input.bucket, input.key);
    return { status: "success" };
  }),

  deleteBucket: privateProcedure
    .input(z.object({ bucket: z.string().min(3) }))
    .mutation(async ({ input }) => {
      await S3.deleteBucket(input.bucket);
      return { status: "success" };
    }),

  renameBucket: privateProcedure
    .input(
      z.object({
        oldName: z.string().min(3),
        newName: z.string().min(3),
      })
    )
    .mutation(async ({ input }) => {
      await S3.renameBucket(input.oldName, input.newName);
      return { status: "success" };
    }),
});
export default s3Router;
