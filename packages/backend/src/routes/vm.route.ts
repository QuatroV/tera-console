import { router, privateProcedure } from "../utils/trpc";
import {
  createInstance as createInstanceRPC,
  deleteInstance as deleteInstanceRPC,
  getInstanceStatus,
  startInstance,
  stopInstance,
} from "../services/clusterManager.service";
import {
  createInstance as createInstanceDB,
  findInstance,
  findUserInstances,
  deleteInstance as deleteInstanceDB,
} from "../services/db.service";
import {
  createInstanceSchema,
  deleteInstanceSchema,
  getInstanceSchema,
  startInstanceSchema,
  stopInstanceSchema,
} from "../schema/vm.schema";

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
          input.dockerImage,
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
          link: result.public_ip,
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
    try {
      // TODO: Убрать это, так как это и так приватный рут
      if (!ctx.user) {
        throw new Error("Пользователь не авторизован");
      }

      const userId = ctx.user.id;

      const instances = await findUserInstances(userId);

      return {
        status: "success",
        instances,
      };
    } catch (error: any) {
      throw new Error(error.message || "Ошибка при получении списка инстансов");
    }
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
});

export default vmRouter;
