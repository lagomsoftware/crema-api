import { authRouter } from "./auth";
import { router } from "../lib/trpc";
import { shotRouter } from "./shot";

const appRouter = router({
  shot: shotRouter,
  auth: authRouter,
});

export default appRouter;
