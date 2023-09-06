import bcrypt from "bcrypt";
import db from "../lib/prisma";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../lib/trpc";
import { z } from "zod";

export const authRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        confirmPassword: z.string().min(1),
        email: z.string().email().min(1),
        password: z.string().min(1),
        name: z.string().min(1),
      })
    )
    .output(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input: { confirmPassword, ...input } }) => {
      if (input.password !== confirmPassword) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Passwords do not match",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      try {
        const user = await db.user.create({
          data: {
            ...input,
            password: hashedPassword,
          },
        });

        const token = jwt.sign(
          { sub: user.id },
          process.env.JWT_TOKEN as string
        );

        return {
          token,
        };
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sign up",
          cause: e,
        });
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email().min(1),
        password: z.string().min(1),
      })
    )
    .output(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password or email",
        });
      }

      const passwordsMatch = await bcrypt.compare(
        input.password,
        user.password
      );

      if (!passwordsMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password or email",
        });
      }

      const token = jwt.sign({ sub: user.id }, process.env.JWT_TOKEN as string);

      return {
        token,
      };
    }),
});
