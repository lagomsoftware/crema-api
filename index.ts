import appRouter from "./routes";
import cors from "cors";
import { createContext } from "./lib/trpcContext";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext,
});

server.listen(process.env.PORT ? +process.env.PORT : 1337);

export type AppRouter = typeof appRouter;
