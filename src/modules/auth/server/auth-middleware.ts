import { createMiddleware } from "hono/factory";
import createError from "http-errors";
import { auth } from "@/lib/auth";

export const requireAdmin = createMiddleware(async (c, next) => {
  const nodeEnv = (c.env as Env)?.NODE_ENV;
  const isDevOrTest = nodeEnv === "development" || nodeEnv === "test";

  // Dev & test bypass
  if (isDevOrTest && c.req.header("x-bypass-admin") === "true") {
    c.set("user", { id: "dev-admin-id", email: "admin@dev.local", role: "admin" });
    c.set("session", { id: "dev-session-id", userId: "dev-admin-id" });
    return await next();
  }

  // Session check
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session?.user) {
    throw createError.Unauthorized("Unauthorized: Please sign in.");
  }

  if (session.user.role !== "admin") {
    throw createError.Forbidden("Forbidden: Admin access required.");
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
});