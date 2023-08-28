import db from "../lib/prisma";
import { protectedProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const beanRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.bean.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.bean.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
        },
      });
    }),
});
