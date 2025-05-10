import { router, privateProcedure } from "../utils/trpc";
import { z } from "zod";
import * as S3 from "../services/s3.service";
import {
  createS3Bucket,
  deleteS3Bucket,
  findS3Bucket,
  findUserS3Buckets,
  renameS3Bucket,
} from "../services/db.service";
import {
  bucketSettingsSchema,
  createBucketSchema,
  createFolderSchema,
  deleteBucketSchema,
  keyInputSchema,
  listObjectsSchema,
  renameBucketSchema,
} from "../schema/s3.schema";

export const s3Router = router({
  listBuckets: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.user) throw new Error("Пользователь не авторизован");

    const dbBuckets = await findUserS3Buckets(ctx.user.id);

    const buckets = await Promise.all(
      dbBuckets.map(async (b) => {
        const { objectCount, totalSize } = await S3.getBucketStats(b.name);

        return {
          Name: b.name,
          CreationDate: b.createdAt.toISOString(),
          ObjectCount: objectCount,
          TotalSize: totalSize,
        };
      })
    );

    return {
      status: "success" as const,
      buckets,
    };
  }),

  createBucket: privateProcedure
    .input(createBucketSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Пользователь не авторизован");

      try {
        // 1) физически создаём в MinIO
        await S3.createBucket(input.name);
        // 2) заводим запись в БД
        await createS3Bucket(input.name, ctx.user.id);
        return { status: "success" as const };
      } catch (err) {
        console.error(err);

        return { status: "error" as const };
      }
    }),

  deleteBucket: privateProcedure
    .input(deleteBucketSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Пользователь не авторизован");

      try {
        // 1) проверяем, есть ли в БД
        const bucket = await findS3Bucket({
          name: input.name,
        });
        if (!bucket) throw new Error("Бакет не найден");
        // 2) удаляем физически
        await S3.deleteBucket(bucket.name);
        // 3) удаляем запись из БД
        await deleteS3Bucket(bucket.name);

        return { status: "success" as const };
      } catch (err) {
        console.error(err);

        return { status: "error" as const };
      }
    }),

  renameBucket: privateProcedure
    .input(renameBucketSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Пользователь не авторизован");

      // 1) физически копируем/переименовываем
      await S3.renameBucket(input.oldName, input.newName);
      // 2) в БД обновляем
      const updated = await renameS3Bucket(input.oldName, input.newName);
      return {
        status: "success" as const,
        bucket: {
          name: updated.name,
          createdAt: updated.createdAt.toISOString(),
        },
      };
    }),

  listObjects: privateProcedure
    .input(listObjectsSchema)
    .query(async ({ input }) => {
      const { folders, files } = await S3.listObjects(
        input.bucket,
        input.prefix
      );
      return { status: "success", items: [...folders, ...files] };
    }),

  createFolder: privateProcedure
    .input(createFolderSchema)
    .mutation(async ({ input }) => {
      // нулевой object создаёт «папку»
      await S3.putObject(input.bucket, input.prefix, new Uint8Array());
      return { status: "success" };
    }),

  putObjectPresigned: privateProcedure
    .input(keyInputSchema)
    .mutation(async ({ input }) => {
      const url = await S3.presignedPut(input.bucket, input.key);
      return { status: "success", url };
    }),

  getObjectPresigned: privateProcedure
    .input(keyInputSchema)
    .query(async ({ input }) => {
      const url = await S3.presignedGet(input.bucket, input.key);
      return { status: "success", url };
    }),

  deleteObject: privateProcedure
    .input(keyInputSchema)
    .mutation(async ({ input }) => {
      await S3.removeObject(input.bucket, input.key);
      return { status: "success" };
    }),
  getBucketSettings: privateProcedure
    .input(z.object({ bucket: z.string() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Пользователь не авторизован");
      const [acl, versioning, logging, enc, life] = await Promise.all([
        S3.getBucketAcl(input.bucket),
        S3.getBucketVersioning(input.bucket),
        S3.getBucketLogging(input.bucket),
        S3.getBucketEncryption(input.bucket),
        S3.getBucketLifecycle(input.bucket),
      ]);
      return {
        status: "success" as const,
        publicRead: acl === "public-read",
        versioning: versioning === "Enabled",
        accessLogging: logging,
        encryption: enc,
        expirationDays: life ?? undefined,
      };
    }),

  updateBucketSettings: privateProcedure
    .input(bucketSettingsSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Пользователь не авторизован");

      try {
        await Promise.all([
          S3.setBucketAcl(
            input.bucket,
            input.publicRead ? "public-read" : "private"
          ),
          S3.setBucketVersioning(input.bucket, input.versioning),
          S3.setBucketLogging(input.bucket, input.accessLogging ?? false),
          S3.setBucketEncryption(input.bucket, input.encryption ?? false),
          input.expirationDays !== undefined &&
            S3.setBucketLifecycle(input.bucket, input.expirationDays),
        ]);

        return { status: "success" as const };
      } catch (err) {
        console.error(err);

        return { status: "error" as const };
      }
    }),
});

export default s3Router;
