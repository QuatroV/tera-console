import { router, publicProcedure } from "../utils/trpc";

const sampleRouter = router({
  hello: publicProcedure.query(async ({ input }) => {
    return { status: "success" };
  }),
});

export default sampleRouter;
