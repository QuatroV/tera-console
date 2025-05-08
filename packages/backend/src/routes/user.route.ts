import { TRPCError } from "@trpc/server";
import { router, publicProcedure, privateProcedure } from "../utils/trpc";
import { deleteUser, updateUser } from "../services/db.service";
import { updateMeSchema } from "../schema/user.schema";

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
  updateMe: privateProcedure
    .input(updateMeSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (!Object.keys(input).length)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Нет данных для обновления",
        });

      const user = await updateUser({ id: ctx.user.id }, input);
      return { status: "success", data: { user } };
    }),

  deleteMe: privateProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    await deleteUser({ id: ctx.user.id });
    ctx.res?.cookie?.("access_token", "", { maxAge: -1 });
    return { status: "success" };
  }),
});

export default userRouter;
