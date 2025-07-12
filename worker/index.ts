import { Hono } from "hono";

export type Env = {
  DB: D1Database;
  DB_ID: string;
  ACCOUNT_ID: string;
  D1_TOKEN: string;
  MY_VAR: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) =>
  c.json({
    name: `${c.env.MY_VAR}`,
  }),
);

export default app;
