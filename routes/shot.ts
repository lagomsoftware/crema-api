import db from "../lib/prisma";
import { protectedProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const shotRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.shot.findMany({
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
        notes: z.string().optional(),
        duration: z.number(),
        yield: z.number(),
        dose: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.shot.create({
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
