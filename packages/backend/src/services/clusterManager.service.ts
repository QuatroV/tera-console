import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// Опции загрузки .proto файла
const PROTO_OPTIONS: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

// Путь к .proto файлу
const PROTO_PATH = path.resolve(
  __dirname,
  "../../protos/cluster_manager.proto"
);

// Загрузка и компиляция .proto файла
const packageDefinition = protoLoader.loadSync(PROTO_PATH, PROTO_OPTIONS);
const grpcPackage = grpc.loadPackageDefinition(packageDefinition) as any;

// Получение конструктора клиента
const ClusterManager = grpcPackage.cluster_manager.ClusterManager;

// Создание экземпляра клиента
const client = new ClusterManager(
  "localhost:50051", // Адрес вашего gRPC сервера
  grpc.credentials.createInsecure()
);

// Функция для создания инстанса
export function createInstance(
  instanceName: string,
  instanceType: string,
  imageSource: string,
  cpu: number,
  memory: number,
  storage: number
): Promise<{
  metadata: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
  status: string;
  public_ip: string;
  private_ip: string;
  network_ids: string[];
  volume_ids: string[];
  hub_link: string;
}> {
  return new Promise((resolve, reject) => {
    const request = {
      name: instanceName,
      instance_type: instanceType,
      cpu: cpu,
      memory: memory,
      storage: storage,
      image_source: imageSource,
    };

    client.CreateInstance(
      request,
      (error: grpc.ServiceError, response: any) => {
        if (error) {
          return reject(new Error(`gRPC error: ${error.message}`));
        }

        resolve(response);
      }
    );
  });
}

// Функция для получения статуса инстанса
export function getInstanceStatus(instanceId: string): Promise<{
  instance_id: string;
  status: string;
}> {
  return new Promise((resolve, reject) => {
    const request = {
      instance_id: instanceId,
    };

    client.GetInstanceStatus(
      request,
      (error: grpc.ServiceError, response: any) => {
        if (error) {
          return reject(new Error(`gRPC error: ${error.message}`));
        }

        resolve(response);
      }
    );
  });
}

// Функция для остановки инстанса
export function stopInstance(instanceId: string): Promise<{
  instance_id: string;
  status: string;
  message: string;
}> {
  return new Promise((resolve, reject) => {
    const request = {
      instance_id: instanceId,
    };

    client.StopInstance(request, (error: grpc.ServiceError, response: any) => {
      if (error) {
        return reject(new Error(`gRPC error: ${error.message}`));
      }

      resolve(response);
    });
  });
}

// Функция для запуска инстанса
export function startInstance(instanceId: string): Promise<{
  instance_id: string;
  status: string;
  message: string;
}> {
  return new Promise((resolve, reject) => {
    const request = {
      instance_id: instanceId,
    };

    client.StartInstance(request, (error: grpc.ServiceError, response: any) => {
      if (error) {
        return reject(new Error(`gRPC error: ${error.message}`));
      }

      resolve(response);
    });
  });
}

// Функция для удаления инстанса
export function deleteInstance(instanceId: string): Promise<{
  instance_id: string;
  status: string;
  message: string;
}> {
  return new Promise((resolve, reject) => {
    const request = {
      instance_id: instanceId,
    };

    client.DeleteInstance(
      request,
      (error: grpc.ServiceError, response: any) => {
        if (error) {
          return reject(new Error(`gRPC error: ${error.message}`));
        }

        resolve(response);
      }
    );
  });
}
