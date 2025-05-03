import { router as trpcRouter } from "../utils/trpc";
import sampleRouter from "./sample.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import vmRouter from "./vm.route";

// combined router
export const appRouter = trpcRouter({
  sample: sampleRouter,
  auth: authRouter,
  user: userRouter,
  vm: vmRouter,
});

export type AppRouter = typeof appRouter;
