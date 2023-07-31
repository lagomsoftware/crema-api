import db from "../lib/prisma";
import { protectedProcedure, router } from "../lib/trpc";

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
});
