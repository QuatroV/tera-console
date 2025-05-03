import { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";

import {
  deserializeUser,
  deserializeWsUser,
} from "../middleware/deserializeUser";

/** HTTP context */
export const createHTTPContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return deserializeUser({ req, res });
};

export type HTTPContext = Awaited<ReturnType<typeof createHTTPContext>>;

/** WebSocket context */
export const createWSContext = async (opts: CreateWSSContextFnOptions) => {
  const token = opts.info.connectionParams?.token as string | undefined;
  const { user } = await deserializeWsUser(token);

  return { user };
};

export type WSContext = Awaited<ReturnType<typeof createWSContext>>;
