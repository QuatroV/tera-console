import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT ?? "http://localhost:9000",
  region: "us-east-1",
  forcePathStyle: true, // критично для MinIO!
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER ?? "minioadmin",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD ?? "minioadmin",
  },
});

export const listBuckets = async () => {
  const { Buckets = [] } = await s3.send(new ListBucketsCommand({}));
  return Buckets.map((b) => ({
    Name: b.Name!,
    CreationDate: b.CreationDate?.toISOString()!,
  }));
};

export const createBucket = async (name: string) => {
  await s3.send(new CreateBucketCommand({ Bucket: name }));
};

export const listObjects = async (bucket: string, prefix = "") => {
  const res = await s3.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      Delimiter: "/",
    })
  );
  const folders =
    res.CommonPrefixes?.map((p) => ({
      Key: p.Prefix!,
      IsDir: true,
      LastModified: "-",
      Size: "-",
      StorageClass: "-",
    })) ?? [];
  const files =
    res.Contents?.filter((o) => o.Key !== prefix).map((o) => ({
      Key: o.Key!,
      IsDir: false,
      LastModified: o.LastModified?.toISOString() ?? "-",
      Size: o.Size ?? "-",
      StorageClass: o.StorageClass ?? "STANDARD",
    })) ?? [];
  return { folders, files };
};

export const putObject = async (
  bucket: string,
  key: string,
  body: Uint8Array | Blob
) => {
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
};

export const removeObject = async (bucket: string, key: string) => {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

export const presignedPut = async (bucket: string, key: string) => {
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, cmd, { expiresIn: 60 });
};

export const presignedGet = async (bucket: string, key: string) => {
  const { GetObjectCommand } = await import("@aws-sdk/client-s3");
  const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
  return await getSignedUrl(s3, cmd, { expiresIn: 300 });
};

export const deleteBucket = async (bucket: string) => {
  const list = await s3.send(
    new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1000 })
  );
  if (list.Contents?.length) {
    await Promise.all(list.Contents.map((o) => removeObject(bucket, o.Key!)));
  }
  await s3.send(new DeleteBucketCommand({ Bucket: bucket }));
};

export const renameBucket = async (oldName: string, newName: string) => {
  await createBucket(newName);

  let ContinuationToken: string | undefined;
  do {
    const page = await s3.send(
      new ListObjectsV2Command({
        Bucket: oldName,
        ContinuationToken,
      })
    );

    await Promise.all(
      (page.Contents ?? []).map((obj) =>
        s3.send(
          new CopyObjectCommand({
            Bucket: newName,
            CopySource: `${oldName}/${encodeURIComponent(obj.Key!)}`,
            Key: obj.Key!,
          })
        )
      )
    );

    ContinuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (ContinuationToken);

  await deleteBucket(oldName);
};
