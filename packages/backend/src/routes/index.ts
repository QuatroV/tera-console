import { router as trpcRouter } from "../utils/trpc";
import sampleRouter from "./sample.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import vmRouter from "./vm.route";
import s3Router from "./s3.route";

// combined router
export const appRouter = trpcRouter({
  sample: sampleRouter,
  auth: authRouter,
  user: userRouter,
  vm: vmRouter,
  s3: s3Router,
});

export type AppRouter = typeof appRouter;
