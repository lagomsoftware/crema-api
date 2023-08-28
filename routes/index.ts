import { authRouter } from "./auth";
import { router } from "../lib/trpc";
import { shotRouter } from "./shot";
import { userRouter } from "./user";
import { beanRouter } from "./bean";

const appRouter = router({
  shot: shotRouter,
  bean: beanRouter,
  user: userRouter,
  auth: authRouter,
});

export default appRouter;
