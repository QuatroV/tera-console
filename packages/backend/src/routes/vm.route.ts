import { router, privateProcedure } from "../utils/trpc";
import {
  createInstance as createInstanceRPC,
  deleteInstance as deleteInstanceRPC,
  execCommand,
  getInstanceStatus,
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
  createInstanceSchema,
  deleteInstanceSchema,
  execCommandSchema,
  getInstanceSchema,
  renameInstanceSchema,
  startInstanceSchema,
  stopInstanceSchema,
  streamLogsSchema,
  streamStatsSchema,
} from "../schema/vm.schema";
import { observable } from "@trpc/server/observable";

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
});

export default vmRouter;
