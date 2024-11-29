import { inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { deserializeUser } from "../middleware/deserializeUser";

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return deserializeUser({ req, res });
};

export type Context = inferAsyncReturnType<typeof createContext>;
