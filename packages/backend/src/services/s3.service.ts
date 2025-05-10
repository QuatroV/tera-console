import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutBucketVersioningCommand,
  GetBucketAclCommand,
  PutBucketAclCommand,
  GetBucketVersioningCommand,
  PutBucketLifecycleConfigurationCommand,
  GetBucketLifecycleConfigurationCommand,
  PutBucketEncryptionCommand,
  GetBucketEncryptionCommand,
  PutBucketLoggingCommand,
  GetBucketLoggingCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { Readable } from "stream";

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

/**
 * Заливает любой Node.js Readable Stream в S3, делая multipart-upload
 */
export async function uploadStream(
  bucket: string,
  key: string,
  stream: Readable
) {
  const uploader = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: stream, // теперь тип соответствует ожидаемому
    },
  });
  await uploader.done();
}

/**
 * Сводная статистика по бакету: общее число объектов и их общий вес.
 * Для счётчика используем KeyCount, а для размера суммируем Size всех объектов.
 */
export const getBucketStats = async (
  bucket: string
): Promise<{
  objectCount: number; // всего ключей
  totalSize: number; // суммарный размер в байтах
}> => {
  let totalCount = 0;
  let totalSize = 0;
  let ContinuationToken: string | undefined;

  do {
    const page = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken,
      })
    );

    // 1) сколько объектов в этой странице
    totalCount += page.KeyCount ?? page.Contents?.length ?? 0;

    // 2) суммируем размер именно файлов; папки-заглушки обычно имеют Size = 0
    if (page.Contents) {
      for (const obj of page.Contents) {
        totalSize += obj.Size ?? 0;
      }
    }

    ContinuationToken = page.IsTruncated
      ? page.NextContinuationToken
      : undefined;
  } while (ContinuationToken);

  return { objectCount: totalCount, totalSize };
};

/**
 * Возвращает Readable-поток содержимого файла из S3 / MinIO.
 */
export async function downloadStream(
  bucket: string,
  key: string
): Promise<Readable> {
  // явно говорим TypeScript’у, какой аутпут мы ждём
  const { Body } = await s3.send(
    new GetObjectCommand({ Bucket: bucket, Key: key })
  );

  // Body в Node-среде всегда Readable, но добавим защиту
  if (!(Body instanceof Readable)) {
    throw new Error("S3: unexpected Body type (не Readable)");
  }
  return Body;
}

export async function getBucketLogging(bucket: string): Promise<boolean> {
  const res = await s3.send(new GetBucketLoggingCommand({ Bucket: bucket }));
  return Boolean(res.LoggingEnabled);
}

export async function setBucketLogging(
  bucket: string,
  enabled: boolean
): Promise<void> {
  await s3.send(
    new PutBucketLoggingCommand({
      Bucket: bucket,
      BucketLoggingStatus: enabled
        ? { LoggingEnabled: { TargetBucket: bucket, TargetPrefix: "logs/" } }
        : {},
    })
  );
}

export async function getBucketEncryption(bucket: string): Promise<boolean> {
  try {
    const res = await s3.send(
      new GetBucketEncryptionCommand({ Bucket: bucket })
    );
    return (
      res.ServerSideEncryptionConfiguration?.Rules?.some(
        (r) => r.ApplyServerSideEncryptionByDefault?.SSEAlgorithm === "AES256"
      ) ?? false
    );
  } catch {
    return false; // еслиEncryptionConfiguration отсутствует
  }
}

export async function setBucketEncryption(
  bucket: string,
  enabled: boolean
): Promise<boolean> {
  if (!enabled) {
    const { DeleteBucketEncryptionCommand } = await import(
      "@aws-sdk/client-s3"
    );
    await s3.send(new DeleteBucketEncryptionCommand({ Bucket: bucket }));
    return false;
  }

  const alreadyOn = await getBucketEncryption(bucket);
  if (alreadyOn) true;

  try {
    await s3.send(
      new PutBucketEncryptionCommand({
        Bucket: bucket,
        ServerSideEncryptionConfiguration: {
          Rules: [
            { ApplyServerSideEncryptionByDefault: { SSEAlgorithm: "AES256" } },
          ],
        },
      })
    );
    return true; // успех
  } catch (e: any) {
    if (String(e.message).includes("KMS is not configured")) {
      return false; // шифрование недоступно
    }
    throw e; // другая ошибка – пробрасываем
  }
}

export async function getBucketLifecycle(
  bucket: string
): Promise<number | null> {
  try {
    const res = await s3.send(
      new GetBucketLifecycleConfigurationCommand({ Bucket: bucket })
    );
    const rule = res.Rules?.find((r) => r.ID === "auto-expire");
    const days = rule?.Expiration?.Days;
    return typeof days === "number" ? days : null;
  } catch {
    return null;
  }
}

export async function setBucketLifecycle(
  bucket: string,
  days: number
): Promise<void> {
  await s3.send(
    new PutBucketLifecycleConfigurationCommand({
      Bucket: bucket,
      LifecycleConfiguration: {
        Rules: [
          {
            ID: "auto-expire",
            Status: "Enabled",
            Filter: {},
            Expiration: { Days: days },
          },
        ],
      },
    })
  );
}

export async function setBucketAcl(
  bucket: string,
  acl: "private" | "public-read"
): Promise<void> {
  await s3.send(new PutBucketAclCommand({ Bucket: bucket, ACL: acl }));
}

export async function getBucketAcl(bucket: string): Promise<string> {
  const res = await s3.send(new GetBucketAclCommand({ Bucket: bucket }));
  const isPublic = res.Grants?.some(
    (g) =>
      g.Grantee?.URI === "http://acs.amazonaws.com/groups/global/AllUsers" &&
      g.Permission === "READ"
  );
  return isPublic ? "public-read" : "private";
}

// Versioning
export async function setBucketVersioning(
  bucket: string,
  enabled: boolean
): Promise<void> {
  await s3.send(
    new PutBucketVersioningCommand({
      Bucket: bucket,
      VersioningConfiguration: {
        Status: enabled ? "Enabled" : "Suspended",
      },
    })
  );
}

export async function getBucketVersioning(bucket: string): Promise<string> {
  const res = await s3.send(new GetBucketVersioningCommand({ Bucket: bucket }));
  return res.Status ?? "Suspended";
}
