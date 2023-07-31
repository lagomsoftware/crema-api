import * as trpcNext from "@trpc/server/adapters/next";
import db from "./prisma";
import jwt from "jsonwebtoken";
import { inferAsyncReturnType } from "@trpc/server";

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (!req.headers.authorization) {
      return null;
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
      const jwtVerification = jwt.verify(
        token,
        process.env.JWT_TOKEN as string,
      );

      return db.user.findUnique({
        where: {
          id: jwtVerification.sub as string,
        },
      });
    } catch {
      return null;
    }
  }

  return {
    user: await getUserFromHeader(),
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
