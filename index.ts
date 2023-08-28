import * as trpcExpress from "@trpc/server/adapters/express";
import appRouter from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import db from "./lib/prisma";
import express from "express";
import { Resend } from "resend";
import { TRPCError } from "@trpc/server";
import { createContext } from "./lib/trpcContext";

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();

app.use(bodyParser.json());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    middleware: cors(),
    createContext,
  })
);

app.post(
  "/waitlist",
  async ({ body: { email } }: { body: { email?: string } }, res) => {
    if (!email || typeof email !== "string") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await resend.emails.send({
      to: email,
      from: "noreply@lagom.software",
      subject: "You're on the Cream waitlist!",
      html: "<p>You are now on the <strong>Crema</strong> waitlist!</p>",
    });

    const eASignup = await db.eASignup.create({
      data: { email },
    });

    res.json(eASignup);
  }
);

app.listen(process.env.PORT ? +process.env.PORT : 1337);

export type AppRouter = typeof appRouter;
