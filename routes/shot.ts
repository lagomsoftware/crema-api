import db from "../lib/prisma";
import { protectedProcedure, router } from "../lib/trpc";

export const shotRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.shot.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
});
