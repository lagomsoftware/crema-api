import { authRouter } from "./auth";
import { router } from "../lib/trpc";
import { shotRouter } from "./shot";
import { userRouter } from "./user";

const appRouter = router({
  shot: shotRouter,
  user: userRouter,
  auth: authRouter,
});

export default appRouter;
