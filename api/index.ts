import { Hono } from "hono";
import { cors } from "hono/cors";
import env from "../env";
import user from "./routes/user";
import sessions from "./routes/sessions"; 

const app = new Hono();

app.use(
  cors({
    origin: (origin, ctx) => {
      const selfUrl = new URL(ctx.req.url);
      const selfOrigin = selfUrl.origin;
      if (!origin || origin === selfOrigin) {
        return origin;
      }
      return "";
    },
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.route("user", user);
app.route("sessions", sessions);

let servedSessions = 0;
app.get("/stats", async (ctx) => {
  servedSessions++;

  const privyAppId = env.PRIVY_APP_ID;

  return ctx.json({
    servedSessions,
    privyAppId,
  });
});

export default app;
