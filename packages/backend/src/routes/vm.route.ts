import { PassThrough } from "stream";
import { router, privateProcedure } from "../utils/trpc";
import {
  backupInstanceStream,
  createInstance as createInstanceRPC,
  deleteInstance as deleteInstanceRPC,
  execCommand,
  getInstanceStatus,
  restoreInstance,
  startInstance,
  stopInstance,
  streamLogs as streamLogsRPC,
  streamStats as streamStatsRPC,
} from "../services/clusterManager.service";
import {
  createInstance as createInstanceDB,
  findInstance,
  findUserInstances,
  deleteInstance as deleteInstanceDB,
  updateInstance,
} from "../services/db.service";
import {
  backupInstanceSchema,
  createInstanceSchema,
  deleteInstanceSchema,
  execCommandSchema,
  getInstanceSchema,
  renameInstanceSchema,
  restoreInstanceSchema,
  startInstanceSchema,
  stopInstanceSchema,
  streamLogsSchema,
  streamStatsSchema,
} from "../schema/vm.schema";
import { observable } from "@trpc/server/observable";
import * as S3 from "../services/s3.service";

const vmRouter = router({
  createInstance: privateProcedure
    .input(createInstanceSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Убрать это, так как это и так приватный рут
      if (!ctx.user) {
        throw new Error("Пользователь не авторизован");
      }

      try {
        const userId = ctx.user.id;
        const instanceType = input.instanceType || "default";
        const instanceName = input.instanceName;
        const cpu = input.cpu || 2; // Значение по умолчанию
        const memory = input.memory || 2048; // Значение по умолчанию (в МБ)
        const storage = input.storage || 20; // Значение по умолчанию (в ГБ)

        const result = await createInstanceRPC(
          instanceName,
          instanceType,
          input.dockerImage || "noImageSet",
          cpu,
          memory,
          storage
        );

        // Сохранить в БД запись о созданном инстансе
        await createInstanceDB({
          id: result.metadata.id,
          name: instanceName,
          userId: userId,
          instanceType: instanceType,
          link: result.hub_link,
        });

        return {
          status: "success",
          instanceId: result.metadata.id,
          message: "Инстанс успешно создан",
        };
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при создании инстанса");
      }
    }),
  getInstances: privateProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      console.error("[getInstances] Пользователь не авторизован");
      throw new Error("Пользователь не авторизован");
    }

    const userId = ctx.user.id;
    console.log(`[getInstances] Получение инстансов пользователя ${userId}`);

    const dbInstances = await findUserInstances(userId);
    console.log(`[getInstances] Найдено в БД ${dbInstances.length} инстансов`);

    const instances: Array<(typeof dbInstances)[0] & { status: string }> = [];
    const summary: Record<string, number> = {
      RUNNING: 0,
      STOPPED: 0,
      CREATING: 0,
      DELETED: 0,
      ERROR: 0,
      UNKNOWN: 0,
    };

    for (const inst of dbInstances) {
      console.log(`[getInstances] Проверка инстанса: ${inst.id}`);

      try {
        const res = await getInstanceStatus(inst.id);
        console.log(
          `[getInstances] gRPC статус инстанса ${inst.id}:`,
          res.status
        );

        if (res.status === "DELETED") {
          console.warn(
            `[getInstances] Инстанс ${inst.id} помечен как DELETED, удаляем из БД`
          );
          await deleteInstanceDB({ id: inst.id });
          summary.DELETED += 1;
          continue;
        }

        instances.push({ ...inst, status: res.status });
        summary[res.status as keyof typeof summary] =
          (summary[res.status as keyof typeof summary] || 0) + 1;

        console.log(
          `[getInstances] Инстанс ${inst.id} добавлен в результат со статусом ${res.status}`
        );
      } catch (e: any) {
        console.error(
          `[getInstances] Ошибка при получении статуса инстанса ${inst.id}:`,
          e.message
        );
        console.warn(
          `[getInstances] Удаляем инстанс ${inst.id} из БД из-за ошибки`
        );
        await deleteInstanceDB({ id: inst.id });
        summary.ERROR += 1;
      }
    }

    console.log(
      `[getInstances] Возвращаем ${instances.length} актуальных инстансов, сводка:`,
      summary
    );

    return {
      status: "success",
      instances,
      summary, // 🔹 сводка статусов
    };
  }),

  getInstance: privateProcedure
    .input(getInstanceSchema)
    .query(async ({ input }) => {
      try {
        const instance = await findInstance({ id: input.id });

        if (!instance) {
          throw new Error("Не найдено инстанса с таким id");
        }

        // Узнаем статус контейнера
        const res = await getInstanceStatus(input.id);

        return {
          status: "success",
          instance: {
            ...instance,
            status: res.status,
          },
        };
      } catch (error: any) {
        throw new Error(
          error.message || "Ошибка при получении списка инстансов"
        );
      }
    }),
  stopInstance: privateProcedure
    .input(stopInstanceSchema)
    .mutation(async ({ input }) => {
      try {
        const instance = await findInstance({ id: input.id });

        if (!instance) {
          throw new Error("Не найдено инстанса с таким id");
        }

        const res = await stopInstance(input.id);

        return {
          status: "success",
          instance: {
            ...instance,
            status: res.status,
          },
        };
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при остановке инстанса");
      }
    }),

  startInstance: privateProcedure
    .input(startInstanceSchema)
    .mutation(async ({ input }) => {
      try {
        const instance = await findInstance({ id: input.id });

        if (!instance) {
          throw new Error("Не найдено инстанса с таким id");
        }

        const res = await startInstance(input.id);

        return {
          status: "success",
          instance: {
            ...instance,
            status: res.status,
          },
        };
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при запуске инстанса");
      }
    }),
  deleteInstance: privateProcedure
    .input(deleteInstanceSchema)
    .mutation(async ({ input }) => {
      try {
        const instance = await findInstance({ id: input.id });

        if (!instance) {
          throw new Error("Не найдено инстанса с таким id");
        }

        const responseRPC = await deleteInstanceRPC(input.id);

        if (responseRPC.status !== "DELETED") {
          throw new Error("gRPC: Ошибка при удалении инстанса");
        }

        const resDB = await deleteInstanceDB({ id: input.id });

        return {
          status: "success",
          instance: {
            ...resDB,
            status: responseRPC.status,
          },
        };
      } catch (error: any) {
        throw new Error(error.message || "Ошибка при удалении инстанса");
      }
    }),
  streamLogs: privateProcedure
    .input(streamLogsSchema)
    .subscription(async function* ({ input }) {
      const call = streamLogsRPC(input.id);

      const queue: string[] = [];
      let done = false;

      const onData = (msg: { line: string }) => queue.push(msg.line);
      const onEnd = () => (done = true);
      const onError = (err: any) => {
        console.error(err);
      };

      call.on("data", onData);
      call.on("end", onEnd);
      call.on("error", onError);

      try {
        while (!done || queue.length > 0) {
          while (queue.length > 0) {
            yield queue.shift()!;
          }
          // sleep на короткое время, чтобы избежать спиннинга
          await new Promise((r) => setTimeout(r, 100));
        }
      } finally {
        // отписка
        call.cancel();
      }
    }),

  execCommand: privateProcedure
    .input(execCommandSchema)
    .subscription(({ input }) => {
      const { instanceId, command } = input;
      return observable<string>((emit) => {
        const call = execCommand(instanceId, command);
        call.on("data", (msg) => emit.next(msg.output));
        call.on("end", () => emit.complete());
        call.on("error", (e) => emit.error(e));
        return () => call.cancel();
      });
    }),
  streamStats: privateProcedure
    .input(streamStatsSchema)
    .subscription(async function* ({ input, signal }) {
      const call = streamStatsRPC(input.instanceId);

      const queue: any[] = [];
      let done = false;
      call.on("data", (msg) => queue.push(msg));
      call.on("end", () => (done = true));
      call.on("error", (err) => {
        done = true;
      });

      try {
        while (!done || queue.length > 0) {
          if (signal?.aborted) {
            break;
          }
          if (queue.length) {
            yield queue.shift()!;
          } else {
            await new Promise((r) => setTimeout(r, 200));
          }
        }
      } finally {
        if (!signal?.aborted) call.cancel();
      }
    }),
  renameInstance: privateProcedure
    .input(renameInstanceSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Пользователь не авторизован");

      const instance = await findInstance({ id: input.instanceId });
      if (!instance) throw new Error("Инстанс не найден");

      const updated = await updateInstance(
        { id: input.instanceId },
        { name: input.newName },
        undefined
      );

      return {
        status: "success",
        instance: updated,
      };
    }),

  backupInstance: privateProcedure
    .input(backupInstanceSchema)
    .mutation(async ({ input, ctx }) => {
      const start = Date.now();
      console.info(`[backupInstance] → called`, {
        instanceId: input.instanceId,
        bucket: input.bucket,
        explicitKey: input.key,
        userId: ctx.user?.id,
      });

      if (!ctx.user) {
        console.warn(`[backupInstance] ✖ user is not authenticated`);
        throw new Error("Пользователь не авторизован");
      }

      const inst = await findInstance({ id: input.instanceId });
      if (!inst || inst.userId !== ctx.user.id) {
        console.warn(
          `[backupInstance] ✖ instance not found or belongs to another user`,
          { instanceId: input.instanceId, instanceOwnerId: inst?.userId }
        );
        throw new Error("Инстанс не найден или не принадлежит вам");
      }

      try {
        const now = Date.now();
        const key =
          input.key ??
          `backups/${input.instanceId}/${now}-${input.instanceId}.tar`;
        console.debug(`[backupInstance] → backup key generated`, { key });

        console.debug(`[backupInstance] → requesting gRPC stream`);
        const grpcStream = await backupInstanceStream(input.instanceId);
        console.debug(`[backupInstance] ✓ gRPC stream opened`);

        // ――― конвертируем gRPC-стрим в классический NodeJS Readable
        const pass = new PassThrough();
        let chunkCount = 0;
        let totalBytes = 0;

        grpcStream.on("data", (msg: { chunk: Uint8Array }) => {
          chunkCount++;
          totalBytes += msg.chunk.length;
          if (chunkCount % 100 === 0) {
            console.trace(
              `[backupInstance] … received chunk #${chunkCount}, bytes so far: ${totalBytes}`
            );
          }
          pass.write(Buffer.from(msg.chunk));
        });

        grpcStream.on("end", () => {
          console.debug(
            `[backupInstance] ✓ gRPC stream ended (chunks: ${chunkCount}, bytes: ${totalBytes})`
          );
          pass.end(); // ← обязательно закрываем PassThrough
        });

        grpcStream.on("error", (err) => {
          console.error(`[backupInstance] ✖ gRPC stream error`, err);
          pass.destroy(err);
        });

        console.debug(`[backupInstance] → uploading to S3`, {
          bucket: input.bucket,
          key,
        });

        // multipart-upload: он прочитает из pass и закончит работу, когда pass.end() вызван.
        await S3.uploadStream(input.bucket, key, pass);

        console.info(`[backupInstance] ✓ upload complete`, {
          bucket: input.bucket,
          key,
          bytesUploaded: totalBytes,
        });

        await updateInstance(
          { id: input.instanceId },
          { lastBackupBucket: input.bucket, lastBackupKey: key }
        );
        console.debug(`[backupInstance] ✓ DB updated with backup reference`);

        const url = `${process.env.MINIO_ENDPOINT || "http://localhost:9000"}/${
          input.bucket
        }/${encodeURIComponent(key)}`;
        const duration = Date.now() - start;
        console.info(
          `[backupInstance] → finished successfully in ${duration} ms`
        );

        return {
          status: "success" as const,
          bucket: input.bucket,
          key,
          url,
          durationMs: duration,
          chunks: chunkCount,
          bytes: totalBytes,
        };
      } catch (err) {
        const duration = Date.now() - start;
        console.error(`[backupInstance] ✖ failed after ${duration} ms`, err);
        return {
          status: "error" as const,
          description: String(err),
        };
      }
    }),

  restoreInstance: privateProcedure
    .input(restoreInstanceSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) throw new Error("Не авторизован");

      try {
        // убедимся, что ключ действительно есть в S3
        const backupStream = await S3.downloadStream(input.bucket, input.key);

        const cpu = input.cpu || 2; // Значение по умолчанию
        const memory = input.memory || 2048; // Значение по умолчанию (в МБ)
        const storage = input.storage || 20; // Значение по умолчанию (в ГБ)

        // стримим его в кластер-менеджер
        const resp = await restoreInstance(
          input.instanceName,
          input.instanceType,
          backupStream,
          ctx.user.id,
          cpu,
          memory,
          storage
        );

        console.log("resprespresp", JSON.stringify(resp));

        // сохраняем в БД
        await createInstanceDB({
          id: resp.instance_id,
          name: input.instanceName,
          userId: ctx.user.id,
          instanceType: input.instanceType,
          link: resp.hub_link,
        });

        return {
          status: "success" as const,
          instanceId: resp.instance_id,
        };
      } catch (err) {
        console.error(err);
        return {
          status: "error" as const,
          instanceId: String(err),
        };
      }
    }),
});

export default vmRouter;
