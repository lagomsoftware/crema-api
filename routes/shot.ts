import db from "../lib/prisma";
import { protectedProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const shotRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.shot.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        bean: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        grindSetting: z.number().optional(),
        beanId: z.string().optional(),
        notes: z.string().optional(),
        acidity: z.number(),
        strength: z.number(),
        duration: z.number(),
        yield: z.number(),
        dose: z.number(),
      }),
    )
    .mutation(async ({ ctx, input: { beanId, ...input } }) => {
      return db.shot.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id,
            },
          },
          ...(beanId
            ? {
                bean: {
                  connect: {
                    id: beanId,
                  },
                },
              }
            : {}),
        },
      });
    }),
});
