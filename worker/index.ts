import { Hono } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import tripsRouter from "./routes/trips";
import expensesRouter from "./routes/expenses";
export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();
const token = "secret";

app.use("*", cors());
app.use("*", bearerAuth({ token }));

app.get("/api", async (c) => {
  return c.json("Hello World!");
});

app.route("/api/trips", tripsRouter);
app.route("/api/expenses", expensesRouter);

export default app;
