import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../utils/trpc";

const userRouter = router({
  getMe: publicProcedure.query(async ({ ctx }) => {
    try {
      const user = ctx.user;
      return {
        status: "success",
        data: {
          user,
        },
      };
    } catch (err: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
    }
  }),
});

export default userRouter;
