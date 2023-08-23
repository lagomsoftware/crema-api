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
  listCoffees: protectedProcedure.query(async ({ ctx }) => {
    const shots = await db.shot.findMany({
      where: {
        userId: ctx.user.id,
        coffee: {
          not: null,
        },
      },
      select: {
        coffee: true,
      },
      distinct: "coffee",
    });

    return shots.map(({ coffee }) => coffee);
  }),
  listDoses: protectedProcedure.query(async ({ ctx }) => {
    const shot = await db.shot.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        userId: ctx.user.id,
        dose: {
          not: null,
        },
      },
      select: {
        dose: true,
      },
    });

    return shot?.dose;
  }),
  create: protectedProcedure
    .input(
      z.object({
        grindSetting: z.number().optional(),
        coffee: z.string().optional(),
        notes: z.string().optional(),
        duration: z.number(),
        yield: z.number(),
        dose: z.number(),
      })
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
