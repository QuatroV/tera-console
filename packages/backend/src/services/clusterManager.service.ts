import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

/* ------------------------------------------------------------------ */
/* 1. Загрузка .proto и создание клиента                              */
/* ------------------------------------------------------------------ */

const PROTO_OPTIONS: protoLoader.Options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const PROTO_PATH = path.resolve(
  __dirname,
  "../../protos/cluster_manager.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, PROTO_OPTIONS);
const grpcPackage = grpc.loadPackageDefinition(packageDefinition) as any;

const ClusterManager = grpcPackage.cluster_manager.ClusterManager;

/** singleton-клиент */
const client = new ClusterManager(
  process.env.GRPC_HOST ?? "localhost:50051",
  grpc.credentials.createInsecure()
);

/* ------------------------------------------------------------------ */
/* 2. Типы ответов (чтобы не тянуть генерируемые .d.ts)               */
/* ------------------------------------------------------------------ */

export interface InstanceResponse {
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
}

export interface InstanceStatusResponse {
  instance_id: string;
  status: string;
}

export interface InstanceActionResponse {
  instance_id: string;
  status: string;
  message: string;
}

export interface LogLine {
  line: string;
}

/* ------------------------------------------------------------------ */
/* 3. Promise-обёртки поверх gRPC unary методов                       */
/* ------------------------------------------------------------------ */

function promisifyUnary<Req, Res>(method: string, request: Req): Promise<Res> {
  return new Promise((resolve, reject) => {
    (client as any)[method](request, (err: grpc.ServiceError, resp: Res) => {
      if (err) return reject(new Error(`gRPC ${method}: ${err.message}`));
      resolve(resp);
    });
  });
}

export function createInstance(
  name: string,
  instanceType: string,
  imageSource: string,
  cpu: number,
  memory: number,
  storage: number
) {
  return promisifyUnary<any, InstanceResponse>("CreateInstance", {
    name,
    instance_type: instanceType,
    image_source: imageSource,
    cpu,
    memory,
    storage,
  });
}

export const getInstanceStatus = (id: string) =>
  promisifyUnary<any, InstanceStatusResponse>("GetInstanceStatus", {
    instance_id: id,
  });

export const stopInstance = (id: string) =>
  promisifyUnary<any, InstanceActionResponse>("StopInstance", {
    instance_id: id,
  });

export const startInstance = (id: string) =>
  promisifyUnary<any, InstanceActionResponse>("StartInstance", {
    instance_id: id,
  });

export const deleteInstance = (id: string) =>
  promisifyUnary<any, InstanceActionResponse>("DeleteInstance", {
    instance_id: id,
  });

/* ------------------------------------------------------------------ */
/* 4. СТРИМ ЛОГОВ: возвращаем ClientReadableStream<LogLine>           */
/* ------------------------------------------------------------------ */

/**
 * streamLogs — сервер-стриминг.
 * Вы сами решаете, как трансформировать поток:
 *   - в tRPC subscription (observable)
 *   - в SSE (res.write)
 *   - или прямо читать .on('data').
 *
 * @example
 *   const call = streamLogs(id);
 *   call.on('data', ({ line }) => console.log(line));
 *   call.on('end', () => console.log('done'));
 */
export function streamLogs(
  instanceId: string
): grpc.ClientReadableStream<LogLine> {
  const req = { instance_id: instanceId };
  return (client as any).StreamLogs(req); // тип any, т.к. d.ts не сгенерены
}

export function execCommand(instanceId: string, command: string) {
  const req = { instance_id: instanceId, command };
  return (client as any).ExecCommand(req) as grpc.ClientReadableStream<{
    output: string;
  }>;
}

export function streamStats(instanceId: string): grpc.ClientReadableStream<{
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  blk_read: number;
  blk_write: number;
  net_rx_bytes: number;
  net_tx_bytes: number;
}> {
  return (client as any).StreamStats({ instance_id: instanceId });
}
