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
  cors(),
  bodyParser.json(),
  async ({ body: { email } }: { body: { email?: string } }, res) => {
    if (!email || typeof email !== "string") {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await resend.emails.send({
      to: email,
      from: "Crema <noreply@lagom.software>",
      subject: "You're on the waitlist!",
      text: "You are now on the Crema waitlist! We'll get back to you when we are ready to start taking on beta testers :)",
      html: "<p>You are now on the <strong>Crema</strong> waitlist!<br /><br />We'll get back to you when we are ready to start taking on beta testers :)</p>",
    });

    const eASignup = await db.eASignup.create({
      data: { email },
    });

    res.json(eASignup);
  }
);

app.listen(process.env.PORT ? +process.env.PORT : 1337);

export type AppRouter = typeof appRouter;
